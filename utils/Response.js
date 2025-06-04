

function createResponse(Data = {}, IsError = false, ErrorMessage = "", statusCode = "200", other){
    const response = {
        Data: Data,
        IsError: IsError,
        ErrorMessage: ErrorMessage,
        statusCode: statusCode,
        other: other
    }

    return response;
}

module.exports = createResponse;