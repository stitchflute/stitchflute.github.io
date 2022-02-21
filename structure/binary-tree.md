包含前中后序遍历，以及层序遍历。
```cpp
struct TreeNode
{
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int val): val(val), left(NULL), right(NULL){}
};

// 递归的方式
void recursive(TreeNode* root, vector<int> &res){
    if(!root) return;
    res.push_back(root->val); // 该行依据前中后遍历的方式而决定，这里是前序
    recursive(root->left, res);
    recursive(root->right, res);
}
vector<int> traversal(TreeNode* root) {
    vector<int> res;
    recursive(root, res);
    return res;
}

// 迭代的方式
vector<int> preOrder(TreeNode* root){
    vector<int> res;
    if(!root) return res;
    stack<TreeNode*> s;
    s.push(root);
    while(!s.empty()){
        TreeNode* t = s.top();
        s.pop();
        res.push_back(t->val);
        if(t->right) s.push(t->right);
        if(t->left) s.push(t->left);
    }
    return res;
}

vector<int> inOrder(TreeNode* root){
    vector<int> res;
    if(!root) return res;
    stack<TreeNode*> s;
    TreeNode* p = root;
    while(!s.empty() || p){
        while(p){
            s.push(p);
            p = p->left;
        }
        TreeNode* t = s.top();
        s.pop();
        res.push_back(t->val);
        p = t->right;
    }
    return res;
}

vector<int> posOrder(TreeNode* root){
    vector<int> res;
    if(!root) return res;
    stack<TreeNode*> s;
    TreeNode* head = root;
    s.push(root);
    while(!s.empty()){
        TreeNode* t = s.top();
        if((!t->left && !t->right) || head == t->left || head == t->right){
            s.pop();
            head = t;
            res.push_back(t->val);
        }
        else{
            if(t->right) s.push(t->right);
            if(t->left) s.push(t->left);
        }
    }
    return res;
}

// 层序遍历
#include <queue>
using std::queue;
vector<int> Order(TreeNode* root){
    vector<int> res;
    if(!root) return res;
    queue<TreeNode*> q;
    q.push(root);
    while(!q.empty()){
        int size = q.size();
        for(int i = 0; i < size; ++i){
            TreeNode* t = q.front();
            q.pop();
            res.push_back(t->val);
            if(t->left) q.push(t->left);
            if(t->right) q.push(t->right);
        }
    }
    return res;
}
// 层序遍历的递归方式，这里是按层输出，输出的是二维数组
void level(TreeNode* root, int l, vector<vector<int>>& res){
    if(!root)
        return;
    if(l == res.size()) res.push_back({});
    res[l].push_back(root->val);
    level(root->left, l+1, res);
    level(root->right, l+1, res);
}
vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> res;
    if(!root)
        return res;
    level(root, 0, res);
    return res;
}
```

