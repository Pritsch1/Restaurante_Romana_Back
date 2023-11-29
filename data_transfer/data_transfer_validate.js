function validate_packed_data(package) {
    if (
        package &&
        typeof package === 'object' &&
        package.hasOwnProperty('data_package_encrypted') &&
        package.hasOwnProperty('iv') &&
        typeof package.data_package_encrypted === 'string' &&
        typeof package.iv === 'object'
    ) {
        return true;
    }
    return false;
}

function validate_sealed_data_package(sealed_data_package) {
    if (
        sealed_data_package &&
        typeof sealed_data_package === 'object' &&
        sealed_data_package.hasOwnProperty('data_package_encrypted') &&
        sealed_data_package.hasOwnProperty('iv') &&
        typeof sealed_data_package.data_package_encrypted === 'string' &&
        typeof sealed_data_package.iv === 'object'
    ) {
        return true;
    }
    return false;
}
module.exports = { validate_packed_data, validate_sealed_data_package };