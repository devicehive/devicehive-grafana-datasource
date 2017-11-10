import lodash from "lodash";


/**
 * Value converter manager
 */
class ConverterManager {

    /**
     * Create new ConverterManager
     */
    constructor() {
        const me = this;

        me.converters = new Map();

        me.converters.set(`Offset`, {
            arguments: [
                { type: `number`, defaultValue: 0 }
            ],
            exec: (a1, value) => a1 + value
        });

        me.converters.set(`Scale`, {
            arguments: [
                { type: `number`, defaultValue: 1 }
            ],
            exec: (a1, value) => a1 * value
        });

        const convertValueOptions = ConverterManager.getUnitConvertOptions();
        const convertTypeOptions = Object.keys(convertValueOptions);

        me.converters.set(`Unit converter`, {
            arguments: [
                { type: `option`, defaultValue: convertTypeOptions[0], options: convertTypeOptions },
                { type: `typedOption`, defaultValue: convertValueOptions[convertTypeOptions[0]][0], options: convertValueOptions },
                { type: `typedOption`, defaultValue: convertValueOptions[convertTypeOptions[0]][0], options: convertValueOptions }
            ],
            exec: (a1, a2, a3, value) => ConverterManager._execUnitConvert(a1, a2, a3, value)
        });
    }

    /**
     * Returns converters Map
     * @returns {Map}
     */
    getConvertersMap() {
        const me = this;

        return me.converters;
    }

    /**
     * Returns list on converters
     * @returns {Array}
     */
    getConvertersList() {
        const me = this;
        const result = [];

        me.converters.forEach((value, key) => {
            result.push(Object.assign({ name: key }, value));
        });

        return result;
    }

    /**
     * Get list of converter names
     * @returns {Array}
     */
    getConvertersNameList() {
        const me = this;

        return Array.from(me.converters.keys());
    }

    /**
     * Return converter config object by converter name
     * @param converterName
     * @returns {Object}
     */
    getConverterObject(converterName) {
        const me = this;

        return me.converters.get(converterName);
    }

    /**
     * Returns default values of converter as object
     * @param converterName
     * @returns {Object}
     */
    getConverterDefaultValuesObject(converterName) {
        const me = this;

        return me.getConverterObject(converterName).arguments.reduce((obj, argument, index) => {
            obj[index] = argument.defaultValue;
            return obj;
        }, {});
    }

    /**
     * Returns converter options
     * @returns {Object}
     */
    static getUnitConvertOptions () {
        return {
            temperature: [ 'C', 'F', 'K' ],
            length: [ 'm', 'mi', 'yd', 'ft', 'in' ],
            weight: [ 'kg', 'lb', 'oz' ],
            volume: [ 'l', 'gal', 'pt' ]
        }
    }

    /**
     * Convert value
     * @param converterName
     * @param value
     * @param args
     * @returns {value}
     */
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

    /**
     * Casting arguments to appropriate type
     * @param value
     * @param argument
     * @private
     */
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

    /**
     * Execute unit convert
     * @param type
     * @param from
     * @param to
     * @param value
     * @returns {*}
     * @private
     */
    static _execUnitConvert (type, from, to, value) {
        let result = value;

        from = from.toUpperCase();
        to = to.toUpperCase();

        switch (type) {
            case 'temperature':
                result = ConverterManager._convertTemperature(from, to, value);
                break;
            case 'length':
                result = ConverterManager._convertLength(from, to, value);
                break;
            case 'weight':
                result = ConverterManager._convertWeight(from, to, value);
                break;
            case 'volume':
                result = ConverterManager._convertVolume(from, to, value);
                break;
        }

        return result;
    }

    /**
     * Convert temperature
     * @param from
     * @param to
     * @param value
     * @returns {*}
     * @private
     */
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

    /**
     * Convert Length
     * @param from
     * @param to
     * @param value
     * @returns {*}
     * @private
     */
    static _convertLength (from, to, value) {
        let result = value;

        switch (from + to) {
            case 'MMI':
                result = value * 0.00062137;
                break;
            case 'MYD':
                result = value * 1.0936;
                break;
            case 'MFT':
                result = value / 0.3048;
                break;
            case 'MIN':
                result = value / 0.0254;
                break;
            case 'MIM':
                result = value / 0.00062137;
                break;
            case 'MIYD':
                result = value * 1760.0;
                break;
            case 'MIFT':
                result = value * 5280.0;
                break;
            case 'MIIN':
                result = value * 63360;
                break;
            case 'YDM':
                result = value / 1.0936;
                break;
            case 'YDMI':
                result = value * 0.00056818;
                break;
            case 'YDFT':
                result = value * 3.0000;
                break;
            case 'YDIN':
                result = value * 36.000;
                break;
            case 'FTM':
                result = value / 3.2808399;
                break;
            case 'FTMI':
                result = value * 0.00018939;
                break;
            case 'FTYD':
                result = value * 0.33333;
                break;
            case 'FTIN':
                result = value * 12;
                break;
            case 'INM':
                result = value * 0.0254;
                break;
            case 'INMI':
                result = value / 63.360;
                break;
            case 'INYD':
                result = value * 0.027778;
                break;
            case 'INFT':
                result = value / 12;
                break;
        }

        return result;
    }

    /**
     * Convert Weight
     * @param from
     * @param to
     * @param value
     * @returns {*}
     * @private
     */
    static _convertWeight (from, to, value) {
        let result = value;

        switch (from + to) {
            case 'KGLB':
                result = value / 0.45359237;
                break;
            case 'KGOZ':
                result = value / 0.02834952;
                break;
            case 'LBKG':
                result = value * 0.45359237;
                break;
            case 'LBOZ':
                result = value * 16;
                break;
            case 'OZKG':
                result = value * 0.02834952;
                break;
            case 'OZLB':
                result = value / 16;
                break;
        }

        return result;
    }

    /**
     * Convert Volume
     * @param from
     * @param to
     * @param value
     * @returns {*}
     * @private
     */
    static _convertVolume (from, to, value) {
        let result = value;

        switch (from + to) {
            case 'LGAL':
                result = value * 0.26417;
                break;
            case 'LPT':
                result = value / 2.113376;
                break;
            case 'GALL':
                result = value / 0.26417;
                break;
            case 'GALPT':
                result = value * 8;
                break;
            case 'PTL':
                result = value / 1.7598;
                break;
            case 'PTGAL':
                result = value / 8;
                break;
        }

        return result;
    }
}

export default ConverterManager;