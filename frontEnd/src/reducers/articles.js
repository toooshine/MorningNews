export default function (whisList = [], action) {
    
    if (action.type === 'saveArticles') {
        return action.articles;
    } else if (action.type === 'addToWishlist') {
        const whisListCopy = [...whisList];
        let findArticle = false;
        for (let i = 0; i < whisListCopy.length; i++){
            if (whisListCopy[i].title === action.articleLiked.title) {
                findArticle = true;
            }
        }
        if (!findArticle) {
            whisListCopy.push(action.articleLiked);
        }
        return whisListCopy;
    } else if ( action.type === 'deleteArticle') {
        const whisListCopy = [...whisList];
        for (let i = 0; i < whisListCopy.length; i++) {
            if (whisListCopy[i].title === action.title) {
                whisListCopy.splice(i, 1);
            }
        }
        return whisListCopy;
    } else {
        return whisList;
    }
}