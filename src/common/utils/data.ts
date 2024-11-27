type TreeNode = { children?: TreeNode[]; [key: string]: any };

export const flatToTree = <T extends TreeNode>(data: T, id: string, pid: string) => {
  const nodeMap: { [key: string]: T } = {};
  const tree: T[] = [];

  data.forEach((item) => {
    nodeMap[item[id]] = item;
  });

  data.forEach((item) => {
    if (!item[pid]) {
      tree.push(nodeMap[item[id]]);
    } else {
      const parent = nodeMap[item[pid]];
      if (!parent) return;
      parent.children = parent.children || [];
      parent.children.push(nodeMap[item[id]]);
    }
  });

  return tree;
};
