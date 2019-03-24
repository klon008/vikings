function template(templateid, data) {
    return templateid
        .replace(
            /%(\w*)%/g,
            function (m, key) {
                return data.hasOwnProperty(key) ? data[key] : "";
            }
        );
}
module.exports = template