module.exports = function parseStringAsArray(text) {
    // Separate text demilited by comman and takes out the spaces.
    return  text.split(',').map(techs => techs.trim());
}