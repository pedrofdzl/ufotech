import {
    useEffect,
    useCallback,
    useLayoutEffect,
    useRef,
    useState,
  } from "react";
  import * as React from "react";
  
  import { db } from "../../firebase/firebase";
  import { collection, getDocs } from "firebase/firestore";
  
  const inf = 1e4;
  const delta = [1, -1, 0, 0, 0, 0, -1, 1];
  const colors = {
    0: "#6c6c6c",
    1: "#a5a5a5",
    2: "#dadada",
    5: "#ffcbcb",
    6: "orange",
    7: "#cf5050",
  };
  const tileMap = {
    0: "limit",
    1: "rack",
    2: "corridor",
    3: "outOfLimits",
    4: "path",
    5: "actualPath",
    6: "start",
    7: "end",
  };
  
  let adjListPath: { [key: number]: { [key: number]: [number, number][] } } = {};
  let route: number[] = [];
  let nextPassBy: number[] = [];
  let previousPath: [number, number][] = [];
  let map: number[][] = [];
  let posNodes: [number, number][] = [];
  let passBy: number[] = [];
  let start = 0;
  let lastEndNode = 0;

  let maxNode: number;
  let parent: number[][];
  let adjMatrix: number[][];
  let visited: number[][];
  
  export default function ProductVisualizer({
    endNode,
    needRoute,
    handleNeedRoute,
    handleGotRoute,
    startCanvasY,
    width,
    height,
  }: {
    endNode: number;
    needRoute: boolean;
    handleNeedRoute: () => void;
    handleGotRoute: (newVal: boolean) => void;
    startCanvasY: number;
    width: number;
    height: number;
  }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const midLeft = useRef(0);
    const midTop = useRef(0);
    const midRight = useRef(0);
    const midBottom = useRef(0);
  
    const [preDone, setPreDone] = useState(false);
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
    const [mouseCoords, setMouseCoords] = useState({ x: -1, y: -1 });
  
    useEffect(() => {
      start = 0;
      adjListPath = {};
      route = [];
      nextPassBy = [];
      previousPath = [];
      map = [];
      posNodes = [];
      passBy = [];
      setPreDone(false);
    }, []);

    useLayoutEffect(() => {
      if (preDone) {
        return;
      }
  
      const init = async () => {
        if (map.length === 0) {
          const getMap = async () => {
            try {
              const querySnapshot = await getDocs(collection(db, "Sucursales"));
              querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.name === "HEB Gómez Morín") {
                  map = new Array(data.rows)
                    .fill(0)
                    .map(() => new Array(data.columns).fill(0));
                  for (let i = 1; i < data.rows; i++) {
                    for (let j = 1; j < data.columns; j++) {
                      map[i][j] = data.map[(i - 1) * data.columns + j - 1];
                    }
                  }
                }
              });
            } catch (e) {
              console.log("Error getting documents: ", e);
            }
          };
        
          await getMap();
        }
  
        if (Object.keys(adjListPath).length === 0) {
          maxNode = -Math.min(...map.flat()) + 1;
          parent = new Array(maxNode)
            .fill(0)
            .map(() => new Array(maxNode).fill(0));
          adjMatrix = new Array(maxNode)
            .fill(inf)
            .map(() => new Array(maxNode).fill(inf));
          visited = new Array(map.length)
            .fill(inf)
            .map(() => new Array(map[1].length).fill(inf));
          for (let i = 1; i < maxNode; i++) {
            adjListPath[i] = {};
          }
          posNodes = new Array(maxNode).fill([]);
    
          function removeVisited(i: number, j: number, visited: number[][]) {
            visited[i][j] = inf;
            for (let k = 0; k < 4; k++) {
              const x = i + delta[k];
              const y = j + delta[k + 4];
              if (map[x][y] < 0) {
                visited[x][y] = inf;
              }
              if (visited[x][y] < inf && map[x][y] === 4) {
                removeVisited(x, y, visited);
              }
            }
          }
    
          function searchAll(
            startX: number,
            startY: number,
            i: number,
            j: number,
            x: number,
            y: number,
            visited: number[][],
            dist: number
          ) {
            if (dist + 1 <= visited[x][y]) {
              visited[x][y] = dist + 1;
              if (
                map[x][y] < 0 &&
                dist + 1 < adjMatrix[-map[startX][startY]][-map[x][y]]
              ) {
                adjMatrix[-map[startX][startY]][-map[x][y]] = dist + 1;
                adjListPath[-map[x][y]][-map[startX][startY]] = [[i, j]];
                return -map[x][y];
              }
              if (map[x][y] === 4) {
                const node = dfs(startX, startY, x, y, visited, dist + 1);
                if (node) {
                  adjListPath[node][-map[startX][startY]].push([i, j]);
                  return node;
                }
              }
            }
          }
    
          function dfs(
            startX: number,
            startY: number,
            i: number,
            j: number,
            visited: number[][],
            dist: number
          ) {
            visited[i][j] = dist;
            for (let k = 0; k < 4; k++) {
              const x = i + delta[k];
              const y = j + delta[k + 4];
              const res = searchAll(startX, startY, i, j, x, y, visited, dist);
              if (res) {
                return res;
              }
            }
            return 0;
          }
    
          function calcGraph() {
            for (let i = 1; i < map.length; i++) {
              for (let j = 1; j < map[1].length; j++) {
                if (map[i][j] < 0) {
                  posNodes[-map[i][j]] = [i, j];
                  adjMatrix[-map[i][j]][-map[i][j]] = 0;
    
                  while (dfs(i, j, i, j, visited, 0));
                  removeVisited(i, j, visited);
                }
              }
            }
          }
    
          function Floyd_Warshall() {
            for (let i = 1; i < adjMatrix.length; i++) {
              for (let j = 1; j < adjMatrix.length; j++) {
                parent[i][j] = i;
              }
            }
    
            for (let k = 1; k < adjMatrix.length; k++) {
              for (let i = 1; i < adjMatrix.length; i++) {
                for (let j = 1; j < adjMatrix.length; j++) {
                  if (adjMatrix[i][k] + adjMatrix[k][j] < adjMatrix[i][j]) {
                    adjMatrix[i][j] = adjMatrix[i][k] + adjMatrix[k][j];
                    parent[i][j] = parent[k][j];
                  }
                }
              }
            }
          }

          calcGraph();
          Floyd_Warshall();
        }

        setPreDone(true);
      };
  
      init();
    }, [endNode, preDone]);
  
    useLayoutEffect(() => {
      if (canvasRef.current && context === null) {
        const renderCtx = canvasRef.current.getContext("2d");
        if (renderCtx) {
          renderCtx.canvas.width = width;
          renderCtx.canvas.height = height;

          setContext(renderCtx);
        }
      }
    }, [context, height, width]);
  
    const drawImage = (
      num: number,
      x: number,
      y: number,
      tileSize: number,
      isPath: boolean
    ) => {
      if (context === null) return;
  
      context.fillStyle = colors[num];
      if (isPath) {
        context.fillRect(
          Math.floor((y - 1.5) * tileSize + midLeft.current),
          Math.floor((x - 1.5) * tileSize + midTop.current),
          tileSize << 1,
          tileSize << 1
        );
      } else {
        context.fillRect(
          (y - 1) * tileSize + midLeft.current,
          (x - 1) * tileSize + midTop.current,
          tileSize,
          tileSize
        );
      }
    };
  
    const draw = (tileSize: number) => {
      for (let x = 1; x < map.length; x++) {
        for (let y = 1; y < map[1].length; y++) {
          let color = map[x][y];
          if (map[x][y] < 0 || map[x][y] >= 4) {
            color = 2;
          }
  
          if (map[x][y] !== 3) {
            drawImage(color, x, y, tileSize, false);
          }
        }
      }
    };
  
    const nextNode = (tileSize: number) => {
      while (previousPath.length) {
        const x = previousPath[previousPath.length - 1][0];
        const y = previousPath[previousPath.length - 1][1];
  
        map[x][y] = 2;
        drawImage(2, x, y, tileSize, true);
  
        previousPath.pop();
      }

      if (route.length) {
        previousPath.push([posNodes[start][0], posNodes[start][1]]);
        const begin = start;
  
        while (start !== nextPassBy.at(-1)) {
          const next = route.at(-1)!;
  
          for (let i = 0; i < adjListPath[start][next].length; i++) {
            const x = adjListPath[start][next][i][0];
            const y = adjListPath[start][next][i][1];
  
            previousPath.push([x, y]);
  
            map[x][y] = 5;
            drawImage(5, x, y, tileSize, true);
          }
  
          start = next;
          route.pop();
        }
  
        map[posNodes[begin][0]][posNodes[begin][1]] = 6;
        drawImage(6, posNodes[begin][0], posNodes[begin][1], tileSize, true);
  
        map[posNodes[start][0]][posNodes[start][1]] = 7;
        drawImage(7, posNodes[start][0], posNodes[start][1], tileSize, true);
  
        nextPassBy.pop();
      }
    };
  
    function getRouteAux(i: number, j: number, begin: number) {
      if (j !== begin) {
        route.push(j);
      }
      if (i !== j) {
        getRouteAux(i, parent[i][j], begin);
      }
    }
    
    function getRoute() {
      passBy = [endNode];

      let index: number;
      let begin = start;

      while (passBy.length) {
        let minDist = inf;
        index = -1;
        for (let i = 0; i < passBy.length; i++) {
          if (adjMatrix[begin][passBy[i]] < minDist) {
            minDist = adjMatrix[begin][passBy[i]];
            index = i;
          }
        }

        nextPassBy.push(passBy[index]);
        getRouteAux(passBy[index], begin, begin);

        begin = passBy[index];
        passBy.splice(index, 1);
      }
      route.reverse();
      nextPassBy.reverse();
    }

    // Draw all map
    useLayoutEffect(() => {
      if (context === null || !preDone) {
        return;
      }
      if (map.length === 0 || Object.keys(adjListPath).length === 0) {
        setPreDone(false);
        return;
      }
  
      const numRows = map.length - 1;
      const numCols = map[1].length;
  
      const tileSizeWidth = Math.floor(width / numCols);
      const tileSizeHeight = Math.floor(height / numRows);
      const tileSize = Math.max(Math.min(tileSizeWidth, tileSizeHeight), 1);
  
      midLeft.current = Math.ceil(
        ((width - tileSize * numCols) >> 1) 
      );
      midTop.current = Math.ceil(
        ((height - tileSize * numRows) >> 1)
      );
      midRight.current = numCols * tileSize;
      midBottom.current = numRows * tileSize;

      context.canvas.width = width;
      context.canvas.height = height;
    
      draw(tileSize);

      if (!endNode) {
        return;
      }

      if (lastEndNode) {
        drawImage(7, posNodes[lastEndNode][0], posNodes[lastEndNode][1], tileSize, true);
      }
      if (previousPath.length) {
        for (let i = 1; i < previousPath.length - 1; i++) {
          const x = previousPath[i][0];
          const y = previousPath[i][1];
  
          map[x][y] = 5;
          drawImage(5, x, y, tileSize, true);
        }
  
        map[previousPath[0][0]][previousPath[0][1]] = 6;
        drawImage(6, previousPath[0][0], previousPath[0][1], tileSize, true);
        map[previousPath[previousPath.length - 1][0]][
          previousPath[previousPath.length - 1][1]
        ] = 7;
        drawImage(7,
          previousPath[previousPath.length - 1][0],
          previousPath[previousPath.length - 1][1],
          tileSize,
          true
        );
      }

      if (lastEndNode !== endNode) {
        handleGotRoute(false);
        if (lastEndNode) {
          map[posNodes[lastEndNode][0]][posNodes[lastEndNode][1]] = 2;
          drawImage(2, posNodes[lastEndNode][0], posNodes[lastEndNode][1], tileSize, true);
        }

        while (previousPath.length) {
          const x = previousPath[previousPath.length - 1][0];
          const y = previousPath[previousPath.length - 1][1];
    
          map[x][y] = 2;
          drawImage(2, x, y, tileSize, true);
    
          previousPath.pop();
        }
        
        map[posNodes[endNode][0]][posNodes[endNode][1]] = 7;
        drawImage(7, posNodes[endNode][0], posNodes[endNode][1], tileSize, true);
        
        lastEndNode = endNode;
      } 

      const { x, y } = mouseCoords;
      if (
        needRoute && x >= 0 && x <= midRight.current && y >= 0 && y <= midBottom.current
      ) {
        
        let nearest = inf;
        let node = -1;
        for (let i = 0; i < posNodes.length; i++) {
          const dist = Math.sqrt(
            (x - posNodes[i][1] * tileSize) ** 2 +
            (y - posNodes[i][0] * tileSize) ** 2
          );
          if (dist < nearest) {
            nearest = dist;
            node = i;
          }
        }
        start = node;
        getRoute();

        nextNode(tileSize);

        setMouseCoords({ x: -1, y: -1 });
        handleNeedRoute();
        handleGotRoute(true);
      }

    }, [width, height, endNode, needRoute, startCanvasY, context, preDone, mouseCoords]);
        
    const getMousePos = (
      event:
        (MouseEvent | React.MouseEvent<HTMLCanvasElement>)
        | (TouchEvent | React.TouchEvent<HTMLCanvasElement>)
    ) => {
      let pageX: number;
      let pageY: number;
      if ("pageX" in event && "pageY" in event) {
        pageX = event.pageX;
        pageY = event.pageY;
      } else if (event.touches && event.touches.length > 0) {
        pageX = event.touches[0].pageX;
        pageY = event.touches[0].pageY;
      } else {
        return;
      }
  
      return { pageX, pageY };
    };

    const handleClick = useCallback((
        event:
          React.MouseEvent<HTMLCanvasElement>
          | React.TouchEvent<HTMLCanvasElement>
        ) => {
          if (context && needRoute) {
            const mousePos = getMousePos(event);
            if (mousePos === undefined) {
              return;
            }
            const { pageX, pageY } = mousePos;
             
            let mapX = pageX - midLeft.current;
            let mapY = pageY - midTop.current - startCanvasY;
            
            setMouseCoords({ x: Math.ceil(mapX), y: Math.ceil(mapY) });
          }
      }, [context, needRoute, startCanvasY]);

    return (
      <div>
        <canvas
          onMouseDown={handleClick}
          onTouchStart={handleClick}
          ref={canvasRef}
          style={{ touchAction: "none" }}
        ></canvas>
      </div>
    );
  }
  