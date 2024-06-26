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
let start = 1;

export default function Canvas({
  nodeQueue,
  handleChange,
  centerButton,
  handleCenterButton,
  width,
  height,
}: {
  nodeQueue: number[];
  handleChange: (nextPassBy: number[]) => void;
  centerButton: boolean;
  handleCenterButton: () => void;
  width: number;
  height: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const leftWidth = useRef(0);
  const leftHeight = useRef(0);
  const isResetRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const lastOffsetRef = useRef({ x: 0, y: 0 });
  const lastViewportTopLeftRef = useRef({ x: 0, y: 0 });

  const [preDone, setPreDone] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [viewportTopLeft, setViewportTopLeft] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (preDone) {
      return;
    }

    const init = async () => {
      if (nodeQueue.length === 0) {
        return;
      }

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

      const maxNode = -Math.min(...map.flat()) + 1;
      const parent = new Array(maxNode)
        .fill(0)
        .map(() => new Array(maxNode).fill(0));
      const adjMatrix = new Array(maxNode)
        .fill(inf)
        .map(() => new Array(maxNode).fill(inf));
      const visited = new Array(map.length)
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

      function getRouteAux(i: number, j: number, begin: number) {
        if (j !== begin) {
          route.push(j);
        }
        if (i !== j) {
          getRouteAux(i, parent[i][j], begin);
        }
      }

      function getRoute() {
        passBy = [...nodeQueue];

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

      calcGraph();
      Floyd_Warshall();
      getRoute();

      handleChange([...nextPassBy]);
      setPreDone(true);
    };

    init();
  }, [nodeQueue, preDone]);

  const reset = useCallback(
    (context: CanvasRenderingContext2D) => {
      if (context && !isResetRef.current) {
        context.canvas.width = width;
        context.canvas.height = height;

        setScale(1);
        setContext(context);
        setOffset({ x: 0, y: 0 });
        setMousePos({ x: 0, y: 0 });
        setViewportTopLeft({ x: 0, y: 0 });

        lastOffsetRef.current = { x: 0, y: 0 };
        lastMousePosRef.current = { x: 0, y: 0 };
        isResetRef.current = true;
      }
    },
    [width, height]
  );

  useLayoutEffect(() => {
    if (canvasRef.current && context === null) {
      const renderCtx = canvasRef.current.getContext("2d");
      if (renderCtx) {
        reset(renderCtx);
      }
    }
  }, [context, height, width]);

  useEffect(() => {
    if (context && centerButton) {
      reset(context);
      handleCenterButton();
    }
  }, [context, centerButton]);

  useEffect(() => {
    start = 1;
    adjListPath = {};
    route = [];
    nextPassBy = [];
    previousPath = [];
    map = [];
    posNodes = [];
    passBy = [];
    reset(context!);
    setPreDone(false);
  }, []);

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
        Math.floor((y - 1.5 + leftWidth.current) * tileSize),
        Math.floor((x - 1.5 + leftHeight.current) * tileSize),
        tileSize << 1,
        tileSize << 1
      );
    } else {
      context.fillRect(
        (y - 1 + leftWidth.current) * tileSize,
        (x - 1 + leftHeight.current) * tileSize,
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

    leftWidth.current = Math.ceil(
      ((width - tileSize * numCols) >> 1) / tileSize
    );
    leftHeight.current = Math.ceil(
      ((height - tileSize * numRows) >> 1) / tileSize
    );

    const storedTransform = context.getTransform();

    context.canvas.width = width;
    context.canvas.height = height;

    context.setTransform(storedTransform);

    draw(tileSize);

    // When resizing, redraw path with or without advancing to next node
    if (
      nodeQueue.length &&
      map[posNodes[nodeQueue.at(-1)!][0]][posNodes[nodeQueue.at(-1)!][1]] !== 7
    ) {
      nextNode(tileSize);
    } else if (previousPath.length) {
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
      drawImage(
        7,
        previousPath[previousPath.length - 1][0],
        previousPath[previousPath.length - 1][1],
        tileSize,
        true
      );
    }

    // context.arc(viewportTopLeft.x, viewportTopLeft.y, 5, 0, 2 * Math.PI);
    // context.fillStyle = "red";
    // context.fill();

    // requestAnimationFrame(drawFrame);
  }, [nodeQueue, width, height, preDone, context, scale, viewportTopLeft]);

  useEffect(() => {
    lastOffsetRef.current = offset;
  }, [offset]);

  useEffect(() => {
    lastViewportTopLeftRef.current = viewportTopLeft;
  }, [viewportTopLeft]);

  // pan when offset or scale changes
  useLayoutEffect(() => {
    if (context && lastOffsetRef.current) {
      const offsetDiff = {
        x: (offset.x - lastOffsetRef.current.x) / scale,
        y: (offset.y - lastOffsetRef.current.y) / scale,
      };

      // const viewportTopLeft = lastViewportTopLeftRef.current;
      // if (viewportTopLeft.x - offsetDiff.x >= 100) {
      //   offsetDiff.x = 0;
      // }
      // if (viewportTopLeft.y - offsetDiff.y >= 100) {
      //   offsetDiff.y = 0;
      // }

      context.translate(offsetDiff.x, offsetDiff.y);

      setViewportTopLeft((prevVal) => ({
        x: prevVal.x - offsetDiff.x,
        y: prevVal.y - offsetDiff.y,
      }));

      isResetRef.current = false;
    }
  }, [context, offset, scale]);

  const doZoom = useCallback(
    (zoom: number) => {
      if (context) {
        const newScale = scale * zoom;
        const limitScale = Math.min(Math.max(newScale, 1), 3);
        if (limitScale !== scale) {
          if (newScale > 3) {
            zoom = 3 / scale;
          } else if (newScale < 1) {
            zoom = 1 / scale;
          }
          // const viewportTopLeftDeltaX = mousePos.x / scale * (1 - 1 / zoom);
          // const viewportTopLeftDeltaY = mousePos.y / scale * (1 - 1 / zoom);

          // if (viewportTopLeft.x + viewportTopLeftDeltaX >= 100 || viewportTopLeft.y + viewportTopLeftDeltaY >= 100) {
          //   return;
          // }

          const viewportTopLeftDelta = {
            x: (mousePos.x / scale) * (1 - 1 / zoom),
            y: (mousePos.y / scale) * (1 - 1 / zoom),
          };
          const newViewportTopLeft = {
            x: viewportTopLeft.x + viewportTopLeftDelta.x,
            y: viewportTopLeft.y + viewportTopLeftDelta.y,
          };

          context.translate(viewportTopLeft.x, viewportTopLeft.y);
          context.scale(zoom, zoom);
          context.translate(-newViewportTopLeft.x, -newViewportTopLeft.y);

          setViewportTopLeft(newViewportTopLeft);
          setScale(scale * zoom);

          isResetRef.current = false;
        }
      }
    },
    [context, scale, mousePos.x, mousePos.y, viewportTopLeft]
  );

  const getMouseMove = (
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

  const mouseMove = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (context) {
        event.preventDefault();

        const mousePos = getMouseMove(event);
        if (mousePos === undefined) {
          return;
        }
        const { pageX, pageY } = mousePos;

        const lastMousePos = lastMousePosRef.current;
        const currentMousePos = { x: pageX, y: pageY };
        lastMousePosRef.current = currentMousePos;

        const mouseDiff = {
          x: currentMousePos.x - lastMousePos.x,
          y: currentMousePos.y - lastMousePos.y,
        };

        // const offsetDiff = {
        //   x: (mouseDiff.x) / scale,
        //   y: (mouseDiff.y) / scale,
        // };

        // const viewportTopLeft = lastViewportTopLeftRef.current;
        // if (viewportTopLeft.x - offsetDiff.x >= 100) {
        //   mouseDiff.x = 0;
        // }
        // if (viewportTopLeft.y - offsetDiff.y >= 100) {
        //   mouseDiff.y = 0;
        // }

        setOffset((prevOffset) => ({
          x: prevOffset.x + mouseDiff.x,
          y: prevOffset.y + mouseDiff.y,
        }));
      }
    },
    [context]
  );

  function getDistance(touch1: Touch, touch2: Touch) {
    const dx = touch2.pageX - touch1.pageX;
    const dy = touch2.pageY - touch1.pageY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function handleTouchStart(event: TouchEvent) {
    if (event.touches.length === 2) {
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const initialDistance = getDistance(touch1, touch2);
      (event.target as HTMLElement).dataset.initialDistance =
        initialDistance.toString();
    }
  }

  function handleTouchEnd(event: TouchEvent) {
    delete (event.target as HTMLElement).dataset.initialDistance;
  }

  const handleUpdateMouse = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (canvasRef.current) {
        if (event instanceof TouchEvent && event.touches.length === 2) {
          const touch1 = event.touches[0];
          const touch2 = event.touches[1];
          const currentDistance = getDistance(touch1, touch2);

          const initialDistance = parseInt(
            (event.target as HTMLElement).dataset.initialDistance || "0"
          );

          const scale = currentDistance / initialDistance;

          (event.target as HTMLElement).dataset.initialDistance =
            currentDistance.toString();

          doZoom(scale);
        }

        const mousePos = getMouseMove(event);
        if (mousePos === undefined) {
          return;
        }
        const { pageX, pageY } = mousePos;

        const viewportMousePos = { x: pageX, y: pageY };
        const topLeftCanvasPos = {
          x: canvasRef.current.offsetLeft,
          y: canvasRef.current.offsetTop,
        };

        setMousePos({
          x: viewportMousePos.x - topLeftCanvasPos.x,
          y: viewportMousePos.y - topLeftCanvasPos.y,
        });
      }
    },
    [context, scale, offset, viewportTopLeft]
  );

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      if (event.cancelable) {
        event.preventDefault();
      }

      if (context) {
        let zoom = 1 - event.deltaY / 500;
        doZoom(zoom);
      }
    },
    [context, mousePos.x, mousePos.y, viewportTopLeft, scale]
  );

  const mouseUp = useCallback(() => {
    document.removeEventListener("mousemove", mouseMove);
    document.removeEventListener("touchmove", mouseMove);
    document.removeEventListener("mouseup", mouseUp);
    document.removeEventListener("touchend", mouseMove);
  }, [mouseMove]);

  const startPan = useCallback(
    (
      event:
        React.MouseEvent<HTMLCanvasElement>
        | React.TouchEvent<HTMLCanvasElement>
    ) => {
      const mousePos = getMouseMove(event);
      if (mousePos === undefined) {
        return;
      }
      const { pageX, pageY } = mousePos;

      lastMousePosRef.current = { x: pageX, y: pageY };

      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("touchmove", mouseMove);
      document.addEventListener("mouseup", mouseUp);
      document.addEventListener("touchend", mouseMove);
    },
    [mouseMove, mouseUp]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) {
      return;
    }

    canvas.addEventListener("mousemove", handleUpdateMouse);
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchmove", handleUpdateMouse);
    canvas.addEventListener("touchend", handleTouchEnd);
    canvas.addEventListener("wheel", handleUpdateMouse);
    canvas.addEventListener("mouseup", mouseUp);
    canvas.addEventListener("touchend", mouseUp);
    return () => {
      canvas.removeEventListener("mousemove", handleUpdateMouse);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleUpdateMouse);
      canvas.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("wheel", handleUpdateMouse);
      canvas.removeEventListener("mouseup", mouseUp);
      canvas.removeEventListener("touchend", mouseUp);
    };
  }, [startPan, handleUpdateMouse, mouseUp]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) {
      return;
    }

    canvas.addEventListener("wheel", handleWheel);
    return () => {
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, [context, mousePos.x, mousePos.y, viewportTopLeft, scale]);

  return (
    <div>
      {/* <pre>scale: {scale}</pre>
        <pre>offset: {JSON.stringify(offset)}</pre>
        <pre>viewportTopLeft: {JSON.stringify(viewportTopLeft)}</pre> */}
      <canvas
        onMouseDown={startPan}
        onTouchStart={startPan}
        ref={canvasRef}
        style={{ touchAction: "none" }}
      ></canvas>
    </div>
  );
}
