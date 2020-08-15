#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

vector<int> longestConsecutiveIncreasingSequence(int *a, int n)
{

    unordered_map<int, int> head;
    unordered_map<int, int> length;
    vector<int> x;
    int i, h, m = -1, el;
    for (i = 0; i < n; i++)
    {
        head[a[i]] = i;
        length[a[i]] = 1;
    }
    for (i = 0; i < n; i++)
    {
        if (length[a[i] + 1])
        {
        }
        if (length[a[i] - 1])
        {
        }
        if (length[a[i]] > m || (length[a[i]] == m && head[a[i]] < h))
        {
            h = head[a[i]];
            m = length[a[i]];
        }
    }
    el = a[h];
    while (m--)
    {
        x.push_back(el++);
    }
    return x;
}

int main()
{
    int n, a[100];
    cin >> n;
    for (int i = 0; i < N; i++)
    {
        cin >> a[i];
    }
    vector<int> v = longestConsecutiveIncreasingSequence(a, n);
    for (int i = 0; i < v.size(); i++)
    {
        cout << v[i] << endl;
    }

    return 0;
}
