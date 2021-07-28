"use strict";

/**
 * Get unique error field name
 */
const uniqueMessage = error => {
    let output;
    
    try {
        let fieldName = error.message.substring(
            error.message.lastIndexOf(".$") + 2, //(-1)
            error.message.lastIndexOf("_1")
            //creating our own custom message
        );
        console.log(fieldName)
        output =
            fieldName.charAt(0).toUpperCase() +
            fieldName.slice(1) +
            " already exists";
            
    } catch (ex) {
        output = "Unique field already exists";
    }

    return output;
};

/**
 * Get the erroror message from error object
 */
exports.errorHandler = error => {
    // console.log(error.message)
    // E11000 duplicate key error collection: ecommerce.users index: email_1 dup key: { email: "gauravgusain48@gmail.com" }

    let message = "";

    if (error.code) {
        switch (error.code) {
            case 11000:
            case 11001:
                message = uniqueMessage(error);
                break;
            default:
                message = "Something went wrong";
        }
    } else {
        for (let errorName in error.errorors) {
            if (error.errorors[errorName].message)
                message = error.errorors[errorName].message;
        }
    }

    return message;
};