var html = function(str, reg) {
    return str ? str.replace(reg || /[&<">'](?:(amp|lt|ldquo|rdquo|quot|gt|#39|nbsp|#\d+);)?/g, function(a, b) {
        if (b) {
            return a;
        } else {
            return {
                '<': '&lt;',
                '&': '&amp;',
                '"': '&quot;',
                '“': '&ldquo;',
                '”': '&rdquo;',
                '>': '&gt;',
                "'": '&#39;'
            }[a];
        }

    }) : '';
};

export default html;
