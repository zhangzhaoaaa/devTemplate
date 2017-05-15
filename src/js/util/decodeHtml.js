var unhtml = function(str) {
    return str ? str.replace(/&((g|l|quo|ldquo|rdquo)t|amp|#39|nbsp);/g, function(m) {
        return {
            '&lt;': '<',
            '&amp;': '&',
            '&quot;': '"',
            '&ldquo;': '“',
            '&rdquo;': '”',
            '&gt;': '>',
            '&#39;': "'",
            '&nbsp;': ' '
        }[m];
    }) : '';
};

export default unhtml;
