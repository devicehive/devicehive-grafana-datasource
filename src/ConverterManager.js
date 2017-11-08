import lodash from "lodash";

class ConverterManager {

    constructor() {
        const me = this;

        me.converters = new Map();

        me.converters.set(`offset`, {
            arguments: [
                { type: `number`, defaultValue: 0 }
            ],
            exec: (a1, value) => a1 + value
        });

        me.converters.set(`scale`, {
            arguments: [
                { type: `number`, defaultValue: 1 }
            ],
            exec: (a1, value) => a1 * value
        });

        const convertValueOptions = ConverterManager._getConvertOptions();
        const convertTypeOptions = Object.keys(convertValueOptions);

        me.converters.set(`convert`, {
            arguments: [
                { type: `option`, defaultValue: convertTypeOptions[0], options: convertTypeOptions },
                { type: `typedOption`, defaultValue: convertValueOptions[convertTypeOptions[0]][0], options: convertValueOptions },
                { type: `typedOption`, defaultValue: convertValueOptions[convertTypeOptions[0]][0], options: convertValueOptions }
            ],
            exec: (a1, a2, a3, value) => ConverterManager._execConvert(a1, a2, a3, value)
        });
    }

    getConvertersMap() {
        const me = this;

        return me.converters;
    }

    getConvertersList() {
        const me = this;
        const result = [];

        me.converters.forEach((value, key) => {
            result.push(Object.assign({ name: key }, value));
        });

        return result;
    }

    getConvertersNameList() {
        const me = this;

        return Array.from(me.converters.keys());
    }

    getConverterObject(converterName) {
        const me = this;

        return me.converters.get(converterName);
    }

    getConverterDefaultValuesObject(converterName) {
        const me = this;

        return me.getConverterObject(converterName).arguments.reduce((obj, argument, index) => {
            obj[index] = argument.defaultValue;
            return obj;
        }, {});
    }


    convert(converterName, value, args) {
        const me = this;
        let result = value;

        if (me.converters.has(converterName)) {
            const converter = me.converters.get(converterName);
            const exec = converter.arguments.reduce((execFunc, argument, index) =>
                execFunc.bind(null, ConverterManager._castArgument(args[index], argument)), converter.exec);

            result = exec(result);
        }

        return result;
    }

    static _castArgument(value, argument) {
        let result = argument.defaultValue;

        switch(argument.type) {
            case `number`:
                const castedValue = Number(value);
                result = lodash.isNumber(castedValue) && !lodash.isNaN(castedValue) ? castedValue : result;
                break;
            case `option`:
            case `typedOption`:
                result = value;
                break;
        }

        return result;
    }

    static _getConvertOptions () {
        return {
            temperature: [ 'C', 'F', 'K' ]
        }
    }

    static _execConvert (type, from, to, value) {
        let result = value;

        switch (type) {
            case 'temperature':
                result = ConverterManager._convertTemperature(from, to, value);
                break;
        }

        return result;
    }

    static _convertTemperature (from, to, value) {
        let result = value;

        switch (from + to) {
            case 'CF':
                result = (value * 9 / 5) + 32;
                break;
            case 'CK':
                result = value + 273.15;
                break;
            case 'FC':
                result = (value - 32) * 5 / 9;
                break;
            case 'FK':
                result = (value + 459.67) * 5 / 9;
                break;
            case 'KC':
                result = value - 273.15;
                break;
            case 'KF':
                result = (value * 9 / 5) - 459.67;
                break;
        }

        return result;
    }
}

export default ConverterManager;