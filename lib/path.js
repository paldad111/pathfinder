const calculatePath = (map, startPos, targetPos, algorithm) => {
  let graph = makeGraph(map.data, map.width, map.height);
  let startNode = getNodeById(graph, startPos);
  let targetNode = getNodeById(graph, targetPos);
  let path = [];
  let cameFrom = {};
  let current = startNode;
  if (algorithm === 'dfs') {
    let stack = new Stack();
    stack.push(startNode);
    cameFrom[startNode.id] = null;
    while (true) {
      current = stack.top();
      path.push(current.id);
      current.visited = true;
      if (current.id === targetNode.id) {
        break;
      }
      let unvisited = 0;
      current.adj.forEach((id) => {
        let node = getNodeById(graph, id);
        if (!node.visited) {
          if (cameFrom[id]) {
          } else {
            cameFrom[id] = current.id;
          }
          stack.push(node);
          unvisited += 1;
        }
      });
      if (unvisited === 0) {
        stack.pop();
      }
    }
  } else if (algorithm === 'bfs') {
    let queue = new Queue();
    queue.enqueue(startNode);
    cameFrom[startNode.id] = null;
    while (true) {
      current = queue.dequeue();
      current.visited = true;
      path.push(current.id);
      if (current.id === targetNode.id) {
        break;
      }
      current.adj.forEach((id) => {
        if (cameFrom[id]) {
        } else {
          cameFrom[id] = current.id;
        }

        let node = getNodeById(graph, id);
        if (!node.visited) {
          node.visited = true;
          queue.enqueue(node);
        }
      });
    }
  } else if (algorithm === 'a*') {
    let pqueue = new Pqueue();
    startNode.acost = 0;
    startNode.open = true;
    pqueue.enqueue(startNode);
    cameFrom[startNode.id] = null;
    closedlist = [];

    while (true) {
      current = pqueue.dequeue();
      current.close = true;
      closedlist.push(current);

      console.log("----------------")
      console.log("deq", current._seq, current.close);
      console.log("----------------")

      path.push(current.id);

      /* is goal */
      if (current.id === targetNode.id) {
              break;
      }

      /* Expand */
      current.adj.forEach( (id) => {
              let node   = getNodeById(graph, id);
              let assign = current.acost + 1;

              if (node.close == true) {
                      return;
              }

              if (node.open == true) {
                      if (assign < node.cost) {
                              console.log("----------------")
                              console.log("req ", node._seq, node.cost, "->", assign);
                              node.cost = assign;
                              pqueue.requeue();
                      }
                      return;
              }

              node.open = true;
              node.acost = assign;

              /* heuristic cost */
              xlen = targetNode.x - node.x;
              ylen = targetNode.y - node.y;


              manhattan = xlen + ylen;
              directto  = Math.sqrt(xlen*xlen + ylen*ylen);
              node.cost = node.acost + directto;

              /*
              console.log(startNode.x, startNode.y);
              console.log(targetNode.x, targetNode.y);
              console.log(manhattan, directto);
              */

              pqueue.enqueue(node);

              if (cameFrom[id]) {
              } else {
                      cameFrom[id] = current.id;
              }
      });
    }
  }

  let optimal = buildOptimal(cameFrom, targetPos);
  return [path, optimal];
};

const makeGraph = (map, width, height) => {
  let graph = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (map[y][x] === 1) {
        continue;
      }
      let adj = [];
      if ((y - 1 > 0) && map[y - 1][x] === 0) {
              adj.push('' + x + ',' + (y - 1));
      }
      if ((y + 1 < map.length) && map[y + 1][x] === 0) {
              adj.push('' + x + ',' + (y + 1));
      }
      if ((x - 1 > 0) && map[y][x - 1] === 0) {
              adj.push('' + (x - 1) + ',' + y);
      }
      if ((x + 1 < map[y].length) && map[y][x + 1] === 0) {
              adj.push('' + (x + 1) + ',' + y);
      }
      let node = new Node('' + x + ',' + y, adj);
      node.x = x;
      node.y = y;
      graph.push(node);
    }
  }
  return graph;
};

const getNodeById = (graph, nodeId) => {
  return graph.reduce((out, node) => {
    if (node.id === nodeId) {
      out = node;
    }
    return out;
  });
};

const buildOptimal = (cameFrom, targetPos) => {
  if(!cameFrom[targetPos]) {
    return null;
  }

  let current = targetPos;
  let path = [];

  while(current) {
    path.unshift(current);
    current = cameFrom[current];
  }

  return path;
};
