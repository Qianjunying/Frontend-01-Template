# 0514 课程总结
> 第六周的作业还没完成，会尽快补上。
## 状态机

- 每个状态都是一个机器
    - 在每个机器里，可以计算、存储、输出
    - 所有的机器接收的输入是一致的
    - 机器本身没有状态 —— 纯函数
- 每个机器知道一个状态
    - 每个机器都有确定的下一个状态（Moore）
    - 每个机器根据输入决定下一个状态（Mealy）

### 有限状态机（Mealy）

- 每个状态设计为一个函数
- 函数参数就是输入
- 返回值为下一个状态
- 练习：判断字符串中有无'a'/'ab'/'abc'...
  - 朴素算法
    ```js
     function findChars(str) {
        let hasA = false;
        for (let i = 0; i < str.length; i++) {
            if (str[i] === 'a') {
                hasA = true;
            } else if (hasA && str[i] === 'b') {
                return true
            } else {
                hasA = false;
            }
        }
        return false;
    }
    ```
   - 状态机
   ```js
   function findChars(str) {
        let state = start;
        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            state = state(char);
            if (state === end) {
                return true;
            }
        }
        return false;
    }
    // 设 Pattern 为“abcde”
    function start(char) {
        // 找 a
        if (char === 'a') {
            return gotA; // 找到了“a”，进入下一环节
        } else {
            return start; // 接收的字符不是 “a”，接着找“a”
        }
    }

    function gotA(char) {
        if (char === 'b') {
            return gotB;
        } else {
            return start;
        }
    }

    function gotB(char) {
        if (char === 'c') {
            return gotC;
        } else {
            return start;
        }
    }

    function gotC(char) {
        if (char === 'd') {
            return gotD;
        } else {
            return start;
        }
    }

    function gotD(char) {
        if (char === 'e') {
            return end;// 全部匹配上了
        } else {
            return start;
        }
    }

    function end(char) {

    }
   ```
- 练习：用状态机判断字符串中有无'aabc'
  ```js
    function findChars(str) {
        let state = start;
        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            state = state(char);
            if (state === end) {
                return true;
            }
        }
        return false;
    }
    // 设 Pattern 为“aabc”
    function start(char) {
        // 找 a
        if (char === 'a') {
            return gotA; // 找到了“a”，进入下一环节
        } else {
            return start; // 接收的字符不是 “a”，接着找“a”
        }
    }

    function gotA(char) {
        if (char === 'b') {
            return gotB;
        } else {
            return start(char);
        }
    }

    function gotB(char) {
        if (char === 'c') {
            return end;
        } else {
            return start;
        }
    }

    function end(char) {

    }
    ```
- 练习：用状态机判断字符串中有无'abcabx'
  ```js
  function findChars(str) {
      let state = start;
      for (let i = 0; i < str.length; i++) {
          const char = str[i];
          state = state(char);
          if (state === end) {
              return true;
          }
      }
      return false;
  }
  // 设 Pattern 为“abcabx”
  function start(char) {
      // 找 a
      if (char === 'a') {
          return gotA1; // 找到了“a”，进入下一环节
      } else {
          return start; // 接收的字符不是 “a”，接着找“a”
      }
  }

  function gotA1(char) {
      if (char === 'b') {
          return gotB1;
      } else {
          return start;
      }
  }

  function gotB1(char) {
      if (char === 'c') {
          return gotC;
      } else {
          return start;
      }
  }

  function gotC(char) {
      if (char === 'a') {
          return gotA2;
      } else {
          return start;
      }
  }

  function gotA2(char) {
      if (char === 'b') {
          return gotB2;
      } else {
          return start;
      }
  }

  function gotB2(char) {
      if (char === 'x') {
          return end;
      } else {
          return gotB1(char);
      }
  }

  function end(char) {

  }
  ```

## 解析 HTML

- 上节课代码更正：response body 的 chunk length 应该是 16 进制的

### 第一步：parser

### 第二步：创建状态机

- HTML 状态：whatwg 12.2.5 Tokenization
- EOF：End of file

### 第三步：解析标签

- Reconsume
- 标签
- 六个状态
- 暂时忽略属性

### 第四步：创建元素

- 状态迁移
- 在标签结束时提交 token

### 第五步：处理属性

- 属性值分为单引号、双引号、无引号

### 第六步：构建树

- 遇到开始标签时，创建元素并入栈，遇到结束标签时出栈
- 自封闭标签入栈后立即出栈
- 任何元素的父元素是它入栈前的栈顶

### 第七步：处理文本节点

- 多个文本节点需要合并
- 与自封闭标签类似
