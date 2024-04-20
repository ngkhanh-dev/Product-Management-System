function createTree(arr, parent = "") {
    const tree = [];
    arr.forEach((item) => {
        if (item.parent_id === parent) {
            item.children = createTree(arr, item.id);
            tree.push(item);
        }
    });
    return tree;
}

module.exports = (records) => {
    const tree = createTree(records);
    return tree;
};
