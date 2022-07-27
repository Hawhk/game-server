

function getNonCanvasHeight() {
    let height = 0;
    let header = document.getElementsByTagName('header');
    let footer = document.getElementsByTagName('footer');
    
    if (header.length > 0) {
        height += header[0].offsetHeight;
    }
    
    if (footer.length > 0) {
        height += footer[0].offsetHeight;
    }
    return height;
}