exports.parse = function (schemaString) {

    try {
        return typeof schemaString !== 'object' ? JSON.parse(schemaString) : schemaString;
    } catch (e) {
        console.log(e);
        return {
            properties:{}
        };
    }

};