let canvas = document.getElementById("goban");
let goban = canvas.getContext("2d");

let cameraX = 0;
let cameraY = 0;
let cameraWidth = 100;
let cameraHeight = 100;

let isTranslating = false;
let translateStartX = -1;
let translateStartY = -1;

let isMoving = -1;
let movingStartX = -1;
let movingStartY = -1;
let movingNodeX = -1;
let movingNodeY = -1;

let connectionStart = -1;

let currentTool = -1;
let currentTeam = 0;
let isSnapping = false;

let mouseX = -1;
let mouseY = -1;

let states = [];

let boardGraph = {};
boardGraph["nodesNum"] = 0;
boardGraph["nodesPos"] = [];
boardGraph["nodesConnection"] = [];
boardGraph["stones"] = [];

function wait(timeout) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}

function generateBoard (boardType, m, n) {
	boardGraph["nodesNum"] = 0;
	boardGraph["nodesPos"] = [];
	boardGraph["nodesConnection"] = [];
	boardGraph["stones"] = [];
	if (!m) {
		m = 9;
	}
	if (!n) {
		n = m;
	}
	let boardScale = 5;
	switch (boardType) {
		case 0:
			//Rectangular board
			boardGraph["nodesNum"] = m*n
			for (let i=0; i<m; i++) {
				for (let j=0; j<n; j++) {
					boardGraph["nodesPos"].push([boardScale * (i + 1), boardScale * (j + 1)]);
				}
			}
			for (let i=0; i<m-1; i++) {
				for (let j=0; j<n; j++) {
					let connection = [n*i + j, n*(i+1) + j];
					boardGraph["nodesConnection"].push(connection);
				}
			}
			for (let i=0; i<m; i++) {
				for (let j=0; j<n-1; j++) {
					let connection = [n*i + j, n*i + (j+1)];
					boardGraph["nodesConnection"].push(connection);
				}
			}
			break;
		case 1:
			//Trihexagonal board
			boardScale = 6;
			boardGraph["nodesNum"] = (2*m + 1) * (2*n + 1) - (m * n);
			for (let i=0; i<2*m+1; i++) {
				for (let j=0; j<2*n+1; j++) {
					let rowOrigin = [-i * boardScale * Math.sqrt(3) / 2, i * boardScale / 2];
					if (!(i % 2 == 1 && j % 2 == 1)) {
						boardGraph["nodesPos"].push([(j - i) * boardScale * Math.sqrt(3) / 2, (j + i) * boardScale / 2]);
					}
				}
			}
			let counter = 0;
			let innerCounter = 0;
			while (counter < boardGraph["nodesNum"] - 1) {
				boardGraph["nodesConnection"].push([counter, counter + 1]);
				if (innerCounter == 2*n - 1) {
					innerCounter = 0;
					counter += (n + 3);
				} else {
					counter++;
					innerCounter++;
				}
			}
			for (let i=0; i<2*n+1; i += 2) {
				counter = i;
				for (let j=0; j<2*m; j++) {
					let newCounter;
					if (j % 2 == 0) {
						newCounter = counter + (2*n + 1) - (i / 2);
						if (i != 0) {
							boardGraph["nodesConnection"].push([counter - 1, newCounter]);
						}
					} else {
						newCounter = counter + (n + 1) + (i / 2);
						if (i != 2*n) {
							boardGraph["nodesConnection"].push([counter, newCounter + 1]);
						}
					}
					boardGraph["nodesConnection"].push([counter, newCounter]);
					counter = newCounter;
				}
			}
			break;
		case 2:
			//Rectrrihexagonal board
/*
			6 + 5 + 5 + 5... (n terms)
			4 + 3 + 3 + 3... (n terms)
			4 + 3 + 3 + 3... (n terms)
			.
			.
			.
			(m rows)
*/
			boardScale = 6;
			boardGraph["nodesNum"] = (6 + 5*(n - 1)) + (m - 1) * (4 + 3*(n - 1));
			for (let i=0; i<m; i++) {
				for (let j=0; j<n; j++) {
					let hexagonOrigin = [Math.sqrt(3) * boardScale * i, 2 * boardScale * j];
					if (i == 0) {
						boardGraph["nodesPos"].push([hexagonOrigin[0], hexagonOrigin[1]]);
						boardGraph["nodesPos"].push([hexagonOrigin[0], hexagonOrigin[1] + boardScale]);
						boardGraph["nodesConnection"].push([boardGraph["nodesPos"].length - 2, boardGraph["nodesPos"].length - 1]);
						if (j != 0) {
							if (j == 1) {
								boardGraph["nodesConnection"].push([boardGraph["nodesPos"].length - 1, boardGraph["nodesPos"].length - 8]);
							} else {
								boardGraph["nodesConnection"].push([boardGraph["nodesPos"].length - 1, boardGraph["nodesPos"].length - 7]);
							}
						}
					}
					boardGraph["nodesPos"].push([hexagonOrigin[0] + (Math.sqrt(3) / 2) * boardScale, hexagonOrigin[1] + (3 / 2) * boardScale]);
					if (i == 0) {
						boardGraph["nodesConnection"].push([boardGraph["nodesPos"].length - 2, boardGraph["nodesPos"].length - 1]);
					} else {
						if (i == 1) {
							boardGraph["nodesConnection"].push([boardGraph["nodesPos"].length - 1, boardGraph["nodesPos"].length - 5*(n-1) - 4 + 2*j]);
						} else {
							boardGraph["nodesConnection"].push([boardGraph["nodesPos"].length - 1, boardGraph["nodesPos"].length - 3*n - 1]);
						}
						if (j == n - 1) {
							boardGraph["nodesConnection"].push([boardGraph["nodesPos"].length - 1, boardGraph["nodesPos"].length - 3*(n + 1) + 1]);
						}
					}
					boardGraph["nodesPos"].push([hexagonOrigin[0] + Math.sqrt(3) * boardScale, hexagonOrigin[1] + boardScale]);
					boardGraph["nodesConnection"].push([boardGraph["nodesPos"].length - 2, boardGraph["nodesPos"].length - 1]);
					boardGraph["nodesPos"].push([hexagonOrigin[0] + Math.sqrt(3) * boardScale, hexagonOrigin[1]]);
					if (j != 0) {
						if (i == 0) {
							if (j == 1) {
								boardGraph["nodesConnection"].push([boardGraph["nodesPos"].length - 1, boardGraph["nodesPos"].length - 8]);
							} else {
								boardGraph["nodesConnection"].push([boardGraph["nodesPos"].length - 1, boardGraph["nodesPos"].length - 7]);
							}
						} else {
							if (j == 1) {
								boardGraph["nodesConnection"].push([boardGraph["nodesPos"].length - 1, boardGraph["nodesPos"].length - 6]);
							} else {
								boardGraph["nodesConnection"].push([boardGraph["nodesPos"].length - 1, boardGraph["nodesPos"].length - 5]);
							}
						}
					}
					boardGraph["nodesConnection"].push([boardGraph["nodesPos"].length - 2, boardGraph["nodesPos"].length - 1]);
					if (j == 0) {
						boardGraph["nodesPos"].push([hexagonOrigin[0] + (Math.sqrt(3) / 2) * boardScale, hexagonOrigin[1] - (boardScale / 2)]);
						boardGraph["nodesConnection"].push([boardGraph["nodesPos"].length - 2, boardGraph["nodesPos"].length - 1]);
						if (i == 0) {
							boardGraph["nodesConnection"].push([boardGraph["nodesPos"].length - 1, boardGraph["nodesPos"].length - 6]);
						} else {
							if (i == 1) {
								boardGraph["nodesConnection"].push([boardGraph["nodesPos"].length - 1, boardGraph["nodesPos"].length - 1 - 5*n]);
								boardGraph["nodesConnection"].push([boardGraph["nodesPos"].length - 1, boardGraph["nodesPos"].length - 5*n]);
							} else {
								boardGraph["nodesConnection"].push([boardGraph["nodesPos"].length - 1, boardGraph["nodesPos"].length - 3*(n + 1)]);
								boardGraph["nodesConnection"].push([boardGraph["nodesPos"].length - 1, boardGraph["nodesPos"].length - 3*(n + 1) + 1]);
							}
						}
					} else {
						if (i == 0) {
							boardGraph["nodesConnection"].push([boardGraph["nodesPos"].length - 1, boardGraph["nodesPos"].length - 9]);
							if (j == 1) {
								boardGraph["nodesConnection"].push([boardGraph["nodesPos"].length - 5, boardGraph["nodesPos"].length - 9]);
							} else {
								boardGraph["nodesConnection"].push([boardGraph["nodesPos"].length - 5, boardGraph["nodesPos"].length - 8]);
							}
						} else {
							if (j == 1) {
								boardGraph["nodesConnection"].push([boardGraph["nodesPos"].length - 1, boardGraph["nodesPos"].length - 7]);
								if (i == 1) {
									boardGraph["nodesConnection"].push([boardGraph["nodesPos"].length - 7, boardGraph["nodesPos"].length - 5*n + 2*j]);
								} else {
									boardGraph["nodesConnection"].push([boardGraph["nodesPos"].length - 7, boardGraph["nodesPos"].length - 3*(n+1) + 1]);
								}
							} else {
								boardGraph["nodesConnection"].push([boardGraph["nodesPos"].length - 1, boardGraph["nodesPos"].length - 6]);
								if (i == 1) {
									boardGraph["nodesConnection"].push([boardGraph["nodesPos"].length - 6, boardGraph["nodesPos"].length - 5*n + 2*j]);
								} else {
									boardGraph["nodesConnection"].push([boardGraph["nodesPos"].length - 6, boardGraph["nodesPos"].length - 3*(n+1) + 1]);
								}
							}
						}
					}
				}
			}
			break;
		case 3:
			//Rhombitrihexagonal board
			for (let i=0; i<m; i++) {
				for (let j=0; j<n+(i%2); j++) {
					let hexagonOrigin = [((3 + Math.sqrt(3)) / 2) * boardScale * i, (Math.sqrt(3) + 1) * boardScale * j - (i % 2) * ((Math.sqrt(3) + 1) / 2) * boardScale];
					let hexagonPoints = [];
					let extraPoints = [];

					hexagonPoints.push(addShapePoint(hexagonOrigin[0], hexagonOrigin[1], -1));
					extraPoints.push(addShapePoint(hexagonOrigin[0] - (Math.sqrt(3) / 2) * boardScale, hexagonOrigin[1] - (1 / 2) * boardScale, hexagonPoints[0]));
					extraPoints.push(addShapePoint(hexagonOrigin[0], hexagonOrigin[1] - boardScale, hexagonPoints[0]));

					hexagonPoints.push(addShapePoint(hexagonOrigin[0] + boardScale, hexagonOrigin[1], -1));
					extraPoints.push(addShapePoint(hexagonOrigin[0] + boardScale, hexagonOrigin[1] - boardScale, hexagonPoints[1]));
					extraPoints.push(addShapePoint(hexagonOrigin[0] + (1 + (Math.sqrt(3) / 2)) * boardScale, hexagonOrigin[1] - (1 / 2) * boardScale, hexagonPoints[1]));

					hexagonPoints.push(addShapePoint(hexagonOrigin[0] + (3 / 2) * boardScale, hexagonOrigin[1] + (Math.sqrt(3) / 2) * boardScale, -1));
					extraPoints.push(addShapePoint(hexagonOrigin[0] + ((3 + Math.sqrt(3)) / 2) * boardScale, hexagonOrigin[1] + ((Math.sqrt(3) - 1) / 2) * boardScale, hexagonPoints[2]));
					extraPoints.push(addShapePoint(hexagonOrigin[0] + ((3 + Math.sqrt(3)) / 2) * boardScale, hexagonOrigin[1] + ((Math.sqrt(3) + 1) / 2) * boardScale, hexagonPoints[2]));

					hexagonPoints.push(addShapePoint(hexagonOrigin[0] + boardScale, hexagonOrigin[1] + Math.sqrt(3) * boardScale, -1));
					extraPoints.push(addShapePoint(hexagonOrigin[0] + (1 + (Math.sqrt(3) / 2)) * boardScale, hexagonOrigin[1] + (Math.sqrt(3) + (1 / 2)) * boardScale, hexagonPoints[3]));
					extraPoints.push(addShapePoint(hexagonOrigin[0] + boardScale, hexagonOrigin[1] + (Math.sqrt(3) + 1) * boardScale, hexagonPoints[3]));

					hexagonPoints.push(addShapePoint(hexagonOrigin[0], hexagonOrigin[1] + Math.sqrt(3) * boardScale, -1));
					extraPoints.push(addShapePoint(hexagonOrigin[0], hexagonOrigin[1] + (Math.sqrt(3) + 1) * boardScale, hexagonPoints[4]));
					extraPoints.push(addShapePoint(hexagonOrigin[0] - (Math.sqrt(3) / 2) * boardScale, hexagonOrigin[1] + (Math.sqrt(3) + (1 / 2)) * boardScale, hexagonPoints[4]));

					hexagonPoints.push(addShapePoint(hexagonOrigin[0] - (1 / 2) * boardScale, hexagonOrigin[1] + (Math.sqrt(3) / 2) * boardScale, -1));
					extraPoints.push(addShapePoint(hexagonOrigin[0] - ((Math.sqrt(3) + 1) / 2) * boardScale, hexagonOrigin[1] + ((Math.sqrt(3) + 1) / 2) * boardScale, hexagonPoints[5]));
					extraPoints.push(addShapePoint(hexagonOrigin[0] - ((Math.sqrt(3) + 1) / 2) * boardScale, hexagonOrigin[1] + ((Math.sqrt(3) - 1) / 2) * boardScale, hexagonPoints[5]));

					for (let k=0; k<hexagonPoints.length; k++) {
						boardGraph["nodesConnection"].push([hexagonPoints[k % hexagonPoints.length], hexagonPoints[(k + 1) % hexagonPoints.length]]);
					}
					for (let k=0; k<extraPoints.length; k++) {
						boardGraph["nodesConnection"].push([extraPoints[k % extraPoints.length], extraPoints[(k + 1) % extraPoints.length]]);
					}
				}
			}
			trimExtraConnections();
			boardGraph["nodesNum"] = boardGraph["nodesPos"].length;
			break;
		case 4:
			//Penrose board
			const kernelCoords = [
				[[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 72, 144, 216, 288], [1, 1, 1, 1, 1]], //Star
				[[0, 0, 0], [32.117516385414, 32.117516385414, -48.7841830520807], [324, 36, 180], [0, 0, 1]], //Ace
				[[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 72, 144, 216, 288], [0, 0, 0, 0, 0]], //Sun
				[[0, 0, 0, -47.5528258147576, 47.5528258147576], [0, 0, 0, 15.45084971874733, 15.45084971874733], [0, 72, -72, -252, -108], [1, 1, 1, 0, 0]], //King
				[[0, -47.5528258147576, 47.5528258147576, 0, 0], [51.1803398874989, -14.27050983124843, -14.27050983124843, 1.1803398874989, 1.1803398874989], [0, -216, -144, -396, -324], [0, 1, 1, 0, 0]], //Jack
				[[-29.3892626146237, 0, 29.3892626146237, 0, 0], [41.1803398874989, 0.72949016875157, 41.1803398874989, -49.27050983124843, -49.27050983124843], [0, 180, 0, -144, -216], [0, 1, 0, 0, 0]], //Queen
				[[47.5528258147577, -47.5528258147577, 0, 0], [-26.4754248593737, -26.4754248593737, 38.9754248593737, 38.9754248593737], [252, 108, 324, 36], [0, 0, 1, 1]]  //Deuce
			];

			let kernel = Math.floor(7 * Math.random());
			shapeCoords = [];
			shapeCoords = [...kernelCoords[kernel]];
			totalShapes = shapeCoords[0].length;
			size = 50;

			let kernelShapes = Math.floor(2 * Math.random());
			let shapeType = Math.floor(2 * Math.random());
			for (let i=0; i<kernelShapes; i++) {
				if (shapeType == 0) {
					drawKiteShape = true;
				} else {
					drawKiteShape = false;
				}
				checkIfLegal();
				legalTiling = false;
				let shapeCoordsCopy = [...shapeCoords];
				let shapeMapCopy = [...shapeMap];
				while (!legalTiling) {
					vertX = 200*Math.random() - 100;
					vertY = 200*Math.random() - 100;
					checkForLockOn(vertX, vertY);
					moveShape(ANG, vertX, vertY);
					totalShapes++;
					shapeMap = mapShapes(shapeCoords, totalShapes, size);
					checkIfLegal();
					if (!legalTiling) {
						totalShapes--;
						shapeCoords = [...shapeCoordsCopy];
						shapeMap = [...shapeMapCopy];
					}
				}
			}

			let requiresForce;
			if (m > 9) {
				requiresForce = true;
				while (requiresForce) {
					requiresForce = addForcedTiles();
					cleanUp();
					shapeMap = mapShapes(shapeCoords, totalShapes, size);
					shapesToAdd = [[], [], [], []];
				}
			}
			for (let i=0; i<Math.floor(Math.sqrt(Math.sqrt(m))) - 1; i++) {
				shapeMap = mapShapes(shapeCoords, totalShapes, size);
				deflate();
			}
			requiresForce = true;
			while (requiresForce) {
				requiresForce = addForcedTiles();
				cleanUp();
				shapeMap = mapShapes(shapeCoords, totalShapes, size);
				shapesToAdd = [[], [], [], []];
			}
			shapeCoordsToBoard(shapeCoords, size);
			for (let i=0; i<boardGraph["nodesNum"]; i++) {
				boardGraph["nodesPos"][i][0] /= (size / 10);
				boardGraph["nodesPos"][i][1] /= (size / 10);
			}
			trimExtraConnections();
			break;
		case 5:
			//Snub-square board
			break;
		case 6:
			//Round board
			boardScale = 3;
			boardGraph["nodesNum"] = m*n;
			for (let i=0; i<m; i++) {
				for (let j=0; j<n; j++) {
					let r = boardScale * (Math.pow((i + 2), 1) + n/2);
					if (i == m - 1) {
						r *= (1 + 1/n);
						if (n < 5) {
							r *= 1.3;
						}
						if (n < 4) {
							r *= 1.3;
						}
					}
					let theta = (2 * Math.PI / n) * j + (i % 2) * (Math.PI / n);
					boardGraph["nodesPos"].push([r * Math.cos(theta), r * Math.sin(theta)]);
				}
			}
			for (let i=0; i<m*n; i++) {
				if (Math.floor(i / n) == 0 || Math.floor(i / n) == m - 1) {
					if (i % n == n - 1) {
						boardGraph["nodesConnection"].push([i, i - (n - 1)]);
					} else {
						boardGraph["nodesConnection"].push([i, i+1]);
					}
				}
				if (Math.floor(i / n) != m - 1) {
					boardGraph["nodesConnection"].push([i, i + n]);
					if (i % n != 0) {
						if (Math.floor(i / n) % 2 == 0) {
							boardGraph["nodesConnection"].push([i, i + n - 1]);
						} else {
							if (i % n != n - 1) {
								if (i + n + 1 < m*n) {
									boardGraph["nodesConnection"].push([i, i + n + 1]);
								}
							} else {
								boardGraph["nodesConnection"].push([i, i + 1]);
							}
						}
					} else {
						if (Math.floor(i / n) % 2 == 0) {
							boardGraph["nodesConnection"].push([i, i + 2*n - 1]);
						} else {
							boardGraph["nodesConnection"].push([i, i + n + 1]);
						}
					}
//					boardGraph["nodesConnection"].push([i, ]);
//					boardGraph["nodesConnection"].push([i, i + n - 1]);
				}
			}
	}
	for (let i=0; i<boardGraph["nodesNum"]; i++) {
		boardGraph["stones"].push(-1);
	}
	pushBoard();
}

function trimExtraConnections () {
	for (let i=0; i<boardGraph["nodesConnection"].length - 1; i++) {
		for (let j=i+1; j<boardGraph["nodesConnection"].length; j++) {
			if ((boardGraph["nodesConnection"][i][0] == boardGraph["nodesConnection"][j][0] && boardGraph["nodesConnection"][i][1] == boardGraph["nodesConnection"][j][1])
			    || (boardGraph["nodesConnection"][i][0] == boardGraph["nodesConnection"][j][1] && boardGraph["nodesConnection"][i][1] == boardGraph["nodesConnection"][j][0])) {
				boardGraph["nodesConnection"].splice(j, 1);
				j--;
			}

		}
	}
}

function addShapePoint (pointX, pointY, connectFrom) {
	boardGraph["nodesNum"] = boardGraph["nodesPos"].length;
	let index = -1;
	const error = 1;
	for (let i=0; i<boardGraph["nodesNum"]; i++) {
		if (Math.abs(boardGraph["nodesPos"][i][0] - pointX) < error && Math.abs(boardGraph["nodesPos"][i][1] - pointY) < error) {
			index = i;
		}
	}
	if (index == -1) {
		boardGraph["nodesNum"]++;
		boardGraph["nodesPos"].push([pointX, pointY]);
		boardGraph["stones"].push(-1);
		index = boardGraph["nodesNum"] - 1;
	}
	if (connectFrom != -1) {
		boardGraph["nodesConnection"].push([connectFrom, index]);
	}
	return index;
}

//converts point the arrays from bertman penrose tiling
function shapeCoordsToBoard (coords, scale) {
	const phi=(1+Math.sqrt(5))/2;
	if (coords.length == 0) {
		return;
	}
	let total = coords[0].length;
	for (let i=0; i<total; i++) {
		let x = coords[0][i];
		let y = coords[1][i];
		let ang = coords[2][i];
		if (coords[3][i] == 0) {
			//Add kite
			let newPoint = addShapePoint(x, y, -1);
			newPoint = addShapePoint(x + scale * Math.sin((36 + ang) * Math.PI / 180), y - scale * Math.cos((36 + ang) * Math.PI / 180), newPoint);
			newPoint = addShapePoint(x + scale * Math.sin(ang * Math.PI / 180), y - scale * Math.cos(ang * Math.PI / 180), newPoint);
			newPoint = addShapePoint(x - scale * Math.sin((36 - ang) * Math.PI / 180), y - scale * Math.cos((36 - ang) * Math.PI / 180), newPoint);
			newPoint = addShapePoint(x, y, newPoint);
		} else {
			//Add dart
			let newPoint = addShapePoint(x, y, -1);
			newPoint = addShapePoint(x + scale * Math.sin((36 + ang) * Math.PI / 180), y - scale * Math.cos((36 + ang) * Math.PI / 180), newPoint);
			newPoint = addShapePoint(x + scale * Math.sin(ang * Math.PI / 180)/phi, y - scale * Math.cos(ang * Math.PI / 180)/phi, newPoint);
			newPoint = addShapePoint(x - scale * Math.sin((36 - ang) * Math.PI / 180), y - scale * Math.cos((36 - ang) * Math.PI / 180), newPoint);
			newPoint = addShapePoint(x, y, newPoint);
		}
	}
}

//converts point in absolute 2D space to a point in
	//x domain: [0, canvas width]
	//y domain: [0, canvas height]
function absolutetoRelative (pointX, pointY, cameraX, cameraY, cameraWidth, cameraHeight) {
	return [canvas.width * (pointX - cameraX) / cameraWidth, canvas.height * (pointY - cameraY) / cameraHeight];
}

//converts point in client window to a point in 2D space
function clienttoAbsolute (pointX, pointY) {
	let canvasRect = canvas.getBoundingClientRect();
	return [(cameraWidth * (pointX - canvasRect.x) / canvasRect.width) + cameraX, (cameraHeight * (pointY - canvasRect.y) / canvasRect.height) + cameraY];
}

function getNearestPoint (target) {
	let distances = [];
	for (let i=0; i<boardGraph["nodesPos"].length; i++) {
		distances.push(Math.sqrt((target[0] - boardGraph["nodesPos"][i][0]) * (target[0] - boardGraph["nodesPos"][i][0]) + (target[1] - boardGraph["nodesPos"][i][1]) * (target[1] - boardGraph["nodesPos"][i][1])));
	}
	return argMin(distances);
}

function getNearestConnection (target) {
	let distances = [];
	for (let i=0; i<boardGraph["nodesConnection"].length; i++) {
		distances.push(findConnectionDistance(target[0], target[1],
			boardGraph["nodesPos"][boardGraph["nodesConnection"][i][0]][0],
			boardGraph["nodesPos"][boardGraph["nodesConnection"][i][0]][1],
			boardGraph["nodesPos"][boardGraph["nodesConnection"][i][1]][0],
			boardGraph["nodesPos"][boardGraph["nodesConnection"][i][1]][1]));
	}
	return argMin(distances);
}

function findConnectionDistance (targetX, targetY, segmentStartX, segmentStartY, segmentEndX, segmentEndY) {
	if (segmentStartY < segmentEndY) {
		if (targetY <= ((-1 * (segmentEndX - segmentStartX) / (segmentEndY - segmentStartY)) * (targetX - segmentStartX)) + segmentStartY) {
			return (targetX - segmentStartX) * (targetX - segmentStartX) + (targetY - segmentStartY) * (targetY - segmentStartY);
		} else if (targetY >= ((-1 * (segmentEndX - segmentStartX) / (segmentEndY - segmentStartY)) * (targetX - segmentEndX)) + segmentEndY) {
			return (targetX - segmentEndX) * (targetX - segmentEndX) + (targetY - segmentEndY) * (targetY - segmentEndY);
		}
	} else if (segmentEndY < segmentStartY) {
		if (targetY >= ((-1 * (segmentEndX - segmentStartX) / (segmentEndY - segmentStartY)) * (targetX - segmentStartX)) + segmentStartY) {
			return (targetX - segmentStartX) * (targetX - segmentStartX) + (targetY - segmentStartY) * (targetY - segmentStartY);
		} else if (targetY <= ((-1 * (segmentEndX - segmentStartX) / (segmentEndY - segmentStartY)) * (targetX - segmentEndX)) + segmentEndY) {
			return (targetX - segmentEndX) * (targetX - segmentEndX) + (targetY - segmentEndY) * (targetY - segmentEndY);
		}
	} else {
		let xMin = Math.min(segmentStartX, segmentEndX);
		let xMax = Math.max(segmentStartX, segmentEndX);
		if (targetX <= xMin) {
			return (targetX - xMin) * (targetX - xMin) + (targetY - segmentStartY) * (targetY - segmentStartY);
		} else if (targetX >= xMax) {
			return (targetX - xMax) * (targetX - xMax) + (targetY - segmentEndY) * (targetY - segmentEndY);
		}
	}
	let u = [targetX - segmentStartX, targetY - segmentStartY];
	let v = [segmentEndX - segmentStartX, segmentEndY - segmentStartY];
	let projUV = [(u[0]*v[0] + u[1]*v[1])/(v[0]*v[0] + v[1]*v[1]) * v[0], (u[0]*v[0] + u[1]*v[1])/(v[0]*v[0] + v[1]*v[1]) * v[1]];
	let w = [u[0] - projUV[0], u[1] - projUV[1]];
	return w[0]*w[0] + w[1]*w[1];
}

function centerCamera () {
	if (boardGraph["nodesNum"] == 0) {
		cameraX = 0;
		cameraY = 0;
		cameraWidth = 100;
		cameraHeight = 100;
		return;
	}
	let xCoords = [];
	let yCoords = [];
	for (let i=0; i<boardGraph["nodesNum"]; i++) {
		xCoords.push(boardGraph["nodesPos"][i][0]);
		yCoords.push(boardGraph["nodesPos"][i][1]);
	}
	let xMin = Math.min(...xCoords);
	let xMax = Math.max(...xCoords);
	let yMin = Math.min(...yCoords);
	let yMax = Math.max(...yCoords);
	if (xMax - xMin > yMax - yMin) {
		cameraWidth = 1.1 * (xMax - xMin);
		cameraHeight = 1.1 * (xMax - xMin);
		cameraX = ((xMax + xMin) / 2) - (cameraWidth / 2);
		cameraY = ((yMax + yMin) / 2) - (cameraHeight / 2);
	} else {
		cameraWidth = 1.1 * (yMax - yMin);
		cameraHeight = 1.1 * (yMax - yMin);
		cameraX = ((xMax + xMin) / 2) - (cameraWidth / 2);
		cameraY = ((yMax + yMin) / 2) - (cameraHeight / 2);
	}
	console.log("cameraX = " + cameraX);
	console.log("cameraY = " + cameraY);
	console.log("cameraWidth = " + cameraWidth);
	console.log("cameraHeight = " + cameraHeight);
}

function teamtoColor (team) {
	switch (team) {
		case 0:
			return "black";
		case 1:
			return "white";
		case 2:
			return "red";
		case 3:
			return "blue";
		case 4:
			return "green";
		case 5:
			return "yellow";
		case 6:
			return "purple";
		case 7:
			return "orange";
	}
}

function renderGoban (camera) {
	goban.fillStyle = "white";
	goban.fillRect(0, 0, canvas.width, canvas.height);
	if (boardGraph["nodesNum"] == 0) {
		return;
	}
	goban.fillStyle = "black";
	let relativePos = [];
	for (let i=0; i<boardGraph["nodesNum"]; i++) {
		let pointPos = absolutetoRelative(boardGraph["nodesPos"][i][0], boardGraph["nodesPos"][i][1], camera[0], camera[1], camera[2], camera[3]);
		relativePos.push([pointPos[0], pointPos[1]]);
	}
	for (let i=0; i<boardGraph["nodesNum"]; i++) {
		goban.beginPath();
		goban.arc(relativePos[i][0], relativePos[i][1], 0.2 * canvas.width / cameraWidth, 0, 2 * Math.PI);
		goban.fill();
	}
	for (let i=0; i<boardGraph["nodesConnection"].length; i++) {
		goban.moveTo(relativePos[boardGraph["nodesConnection"][i][0]][0], relativePos[boardGraph["nodesConnection"][i][0]][1]);
		goban.lineTo(relativePos[boardGraph["nodesConnection"][i][1]][0], relativePos[boardGraph["nodesConnection"][i][1]][1]);
	}
	goban.stroke();
	for (let i=0; i<boardGraph["nodesNum"]; i++) {
		if (boardGraph["stones"][i] != -1) {
			goban.lineWidth = 5;
			goban.beginPath();
			goban.arc(relativePos[i][0], relativePos[i][1], 2 * canvas.width / cameraWidth, 0, 2 * Math.PI);
			goban.stroke();
			goban.lineWidth = 1;
			goban.fillStyle = teamtoColor(boardGraph["stones"][i]);
			goban.beginPath();
			goban.arc(relativePos[i][0], relativePos[i][1], 2 * canvas.width / cameraWidth, 0, 2 * Math.PI);
			goban.fill();
		}
	}
}

function pushBoard () {
	states.push(JSON.parse(JSON.stringify(boardGraph)));
}

function popBoard () {
	if (states.length > 1) {
		boardGraph = JSON.parse(JSON.stringify(states[states.length - 2]));
		states.splice(states.length - 1, 1);
	}
	renderGoban([cameraX, cameraY, cameraWidth, cameraHeight]);
}

canvas.addEventListener("mousedown", (event) => {
	event = event || window.event;
	if (event.which == 2 || event.button == 4 || currentTool == 0) {
		isTranslating = true;
		translateStartX = event.clientX;
		translateStartY = event.clientY;
		document.body.style.cursor = "move";
	} else if (currentTool == 2) {
		isMoving = getNearestPoint(clienttoAbsolute(event.clientX, event.clientY));
		movingStartX = event.clientX;
		movingStartY = event.clientY;
		movingNodeX = boardGraph["nodesPos"][isMoving][0];
		movingNodeY = boardGraph["nodesPos"][isMoving][1];
	}
});

canvas.addEventListener("click", (event) => {
	switch (currentTool) {
		case 1:
			boardGraph["nodesNum"]++;
			if (isSnapping) {
				let newPoint = clienttoAbsolute(event.clientX, event.clientY);
				boardGraph["nodesPos"].push([Math.round(newPoint[0]), Math.round(newPoint[1])]);
			} else {
				boardGraph["nodesPos"].push(clienttoAbsolute(event.clientX, event.clientY));
			}
			boardGraph["stones"].push(-1);
			pushBoard();
			break;
		case 3:
			let deletion = getNearestPoint(clienttoAbsolute(event.clientX, event.clientY));
			boardGraph["nodesNum"]--;
			boardGraph["nodesPos"].splice(deletion, 1);
			boardGraph["stones"].splice(deletion, 1);
			for (let i=0; i<boardGraph["nodesConnection"].length; i++) {
				if (boardGraph["nodesConnection"][i][0] == deletion || boardGraph["nodesConnection"][i][1] == deletion) {
					boardGraph["nodesConnection"].splice(i, 1);
					i--;
				} else {
					if (boardGraph["nodesConnection"][i][0] > deletion) {
						boardGraph["nodesConnection"][i][0]--;
					}
					if (boardGraph["nodesConnection"][i][1] > deletion) {
						boardGraph["nodesConnection"][i][1]--;
					}
				}
			}
			pushBoard();
			break;
		case 4:
			boardGraph["nodesNum"] = 0;
			boardGraph["nodesPos"] = [];
			boardGraph["nodesConnection"] = [];
			boardGraph["stones"] = [];
			pushBoard();
			break;
		case 5:
			if (event.which == 3) {
				connectionStart = -1;
			} else if (connectionStart == -1) {
				connectionStart = getNearestPoint(clienttoAbsolute(event.clientX, event.clientY));
			} else {
				let connectionEnd = getNearestPoint(clienttoAbsolute(event.clientX, event.clientY));
				let connectionExists = false;
				for (let i=0; i<boardGraph["nodesConnection"]; i++) {
					if (boardGraph["nodesConnection"][i][0] == connectionStart && boardGraph["nodesConnection"][i][1] == connectionEnd) {
						connectionExists = true;
					}
				}
				if (!connectionExists) {
					boardGraph["nodesConnection"].push([connectionStart, connectionEnd]);
				}
				connectionStart = -1;
			}
			pushBoard();
			break;
		case 6:
			let deletionConnection = getNearestConnection(clienttoAbsolute(event.clientX, event.clientY));
			boardGraph["nodesConnection"].splice(deletionConnection, 1);
			pushBoard();
			break;
		case 7:
			boardGraph["nodesConnection"] = [];
			pushBoard();
			break;
		case 8:
			boardGraph["stones"][getNearestPoint(clienttoAbsolute(event.clientX, event.clientY))] = currentTeam;
			pushBoard();
			break;
		case 9:
			boardGraph["stones"][getNearestPoint(clienttoAbsolute(event.clientX, event.clientY))] = -1;
			pushBoard();
			break;
		case 10:
			for (let i=0; i<boardGraph["nodesNum"]; i++) {
				boardGraph["stones"][i] = -1;
			}
			pushBoard();
			break;
	}
	renderGoban([cameraX, cameraY, cameraWidth, cameraHeight]);
});

document.body.addEventListener("mouseup", (event) => {
	event = event || window.event;
	if (isTranslating) {
		let canvasRect = canvas.getBoundingClientRect();
		let deltaX = cameraWidth * (translateStartX - event.clientX) / canvasRect.width;
		let deltaY = cameraHeight * (translateStartY - event.clientY) / canvasRect.height;
		cameraX += deltaX;
		cameraY += deltaY;
		renderGoban([cameraX, cameraY, cameraWidth, cameraHeight]);
		isTranslating = false;
		translateStartX = -1;
		translateStartY = -1;
		document.body.style.cursor = "auto";
	}
	if (isMoving != -1) {
		let canvasRect = canvas.getBoundingClientRect();
		let deltaX = cameraWidth * (event.clientX - movingStartX) / canvasRect.width;
		let deltaY = cameraHeight * (event.clientY - movingStartY) / canvasRect.height;
		if (isSnapping) {
			boardGraph["nodesPos"][isMoving][0] = Math.round(movingNodeX + deltaX);
			boardGraph["nodesPos"][isMoving][1] = Math.round(movingNodeY + deltaY);
		} else {
			boardGraph["nodesPos"][isMoving][0] = movingNodeX + deltaX;
			boardGraph["nodesPos"][isMoving][1] = movingNodeY + deltaY;
		}
		renderGoban([cameraX, cameraY, cameraWidth, cameraHeight]);
		isMoving = -1;
		movingStartX = -1;
		movingStartY = -1;
	}
});

document.body.addEventListener("mousemove", (event) => {
	let canvasRect = canvas.getBoundingClientRect();
	let deltaX = cameraWidth * (translateStartX - event.clientX) / canvasRect.width;
	let deltaY = cameraHeight * (translateStartY - event.clientY) / canvasRect.height;
	if (isTranslating) {
		renderGoban([cameraX + deltaX, cameraY + deltaY, cameraWidth, cameraHeight]);
	}
	if (isMoving != -1) {
		deltaX = cameraWidth * (event.clientX - movingStartX) / canvasRect.width;
		deltaY = cameraHeight * (event.clientY - movingStartY) / canvasRect.height;
		boardGraph["nodesPos"][isMoving][0] = movingNodeX + deltaX;
		boardGraph["nodesPos"][isMoving][1] = movingNodeY + deltaY;
		renderGoban([cameraX, cameraY, cameraWidth, cameraHeight]);
	}
	if (connectionStart != -1) {
		let point = clienttoAbsolute(event.clientX, event.clientY);
		let startPoint = absolutetoRelative(boardGraph["nodesPos"][connectionStart][0], boardGraph["nodesPos"][connectionStart][1], cameraX, cameraY, cameraWidth, cameraHeight);
		let endPoint = absolutetoRelative(point[0], point[1], cameraX, cameraY, cameraWidth, cameraHeight);
		renderGoban([cameraX, cameraY, cameraWidth, cameraHeight]);
		goban.moveTo(startPoint[0], startPoint[1]);
		goban.lineTo(endPoint[0], endPoint[1]);
		goban.stroke();
	}
	if (currentTool == 8) {
		if (!isTranslating) {
			deltaX = 0;
			deltaY = 0;
		}
		let point = boardGraph["nodesPos"][getNearestPoint(clienttoAbsolute(event.clientX, event.clientY))];
		let centerPoint = absolutetoRelative(point[0], point[1], cameraX, cameraY, cameraWidth, cameraHeight);
		renderGoban([cameraX + deltaX, cameraY + deltaY, cameraWidth, cameraHeight]);
		goban.lineWidth = 5;
		goban.globalAlpha = 0.6;
		goban.beginPath();
		goban.arc(centerPoint[0], centerPoint[1], 2 * canvas.width / cameraWidth, 0, 2 * Math.PI);
		goban.stroke();
		goban.lineWidth = 1;
		goban.fillStyle = teamtoColor(currentTeam);
		goban.beginPath();
		goban.arc(centerPoint[0], centerPoint[1], 2 * canvas.width / cameraWidth, 0, 2 * Math.PI);
		goban.fill();
		goban.globalAlpha = 1;
	}
	mouseX = event.clientX;
	mouseY = event.clientY;
});

canvas.addEventListener("wheel", (event) => {
	let changeProportion = cameraWidth / 10;
	cameraWidth += changeProportion * Math.sign(event.deltaY);
	cameraHeight += changeProportion * Math.sign(event.deltaY);
	cameraX -= (changeProportion / 2) * Math.sign(event.deltaY);
	cameraY -= (changeProportion / 2) * Math.sign(event.deltaY);
	renderGoban([cameraX, cameraY, cameraWidth, cameraHeight]);
});

pushBoard();
renderGoban([cameraX, cameraY, cameraWidth, cameraHeight]);

let toolBtns = document.getElementsByClassName("toolBtn");
for (let i=0; i<toolBtns.length; i++) {
	toolBtns[i].addEventListener("click", () => {
		for (let j=0; j<toolBtns.length; j++) {
			toolBtns[j].style.outline = "none";
		}
		if (currentTool != i) {
			toolBtns[i].style.outline = "0.8vh solid red";
			currentTool = i;
		} else {
			currentTool = -1;
		}
	});
}

window.onresize = windowResize;

function windowResize() {
	let toolbarRect = document.getElementById("toolbar").getBoundingClientRect();
	document.getElementById("extraToolWrapper").style.left = toolbarRect.right + "px";
	document.getElementById("extraToolWrapper").style.right = 0;
	document.getElementById("extraToolWrapper").style.width = (window.screenRight - toolbarRect.right) + "px";
}

windowResize();

document.getElementById("snapInput").addEventListener("change", (event) => {
	isSnapping = event.currentTarget.checked;
});

document.getElementById("teamNumber").addEventListener("change", () => {
	if (document.getElementById("teamNumber").value) {
		currentTeam = parseInt(document.getElementById("teamNumber").value) - 1;
	}
});

document.getElementById("undoBtn").addEventListener("click", () => {
	popBoard();
});

document.getElementById("generateBtn").addEventListener("click", () => {
	generateBoard(parseInt(document.getElementById("boardTypeInput").value), parseInt(document.getElementById("boardSizeInput").value), parseInt(document.getElementById("boardSize2Input").value));
	centerCamera();
	renderGoban([cameraX, cameraY, cameraWidth, cameraHeight]);
});

document.getElementById("boardTypeInput").addEventListener("change", () => {
	let boardType = parseInt(document.getElementById("boardTypeInput").value);
	if (boardType == 0 || boardType == 1 || boardType == 2 || boardType == 3 || boardType == 6) {
		document.getElementById("boardSize2Wrapper").style.visibility = "visible";
		document.getElementById("boardSizeLabel").innerHTML = "Board Width";
	} else {
		document.getElementById("boardSize2Wrapper").style.visibility = "hidden";
		document.getElementById("boardSizeLabel").innerHTML = "Board Size";
	}
});

document.addEventListener("keydown", (event) => {
	switch (event.keyCode) {
		case 49:
			document.getElementById("teamNumber").value = 1;
			currentTeam = 0;
			break;
		case 50:
			document.getElementById("teamNumber").value = 2;
			currentTeam = 1;
			break;
		case 51:
			document.getElementById("teamNumber").value = 3;
			currentTeam = 2;
			break;
		case 52:
			document.getElementById("teamNumber").value = 4;
			currentTeam = 3;
			break;
		case 53:
			document.getElementById("teamNumber").value = 5;
			currentTeam = 4;
			break;
		case 54:
			document.getElementById("teamNumber").value = 6;
			currentTeam = 5;
			break;
		case 55:
			document.getElementById("teamNumber").value = 7;
			currentTeam = 6;
			break;
		case 56:
			document.getElementById("teamNumber").value = 8;
			currentTeam = 7;
			break;
	}
	if (currentTool == 8) {
		let point = boardGraph["nodesPos"][getNearestPoint(clienttoAbsolute(mouseX, mouseY))];
		let centerPoint = absolutetoRelative(point[0], point[1], cameraX, cameraY, cameraWidth, cameraHeight);
		renderGoban([cameraX, cameraY, cameraWidth, cameraHeight]);
		goban.lineWidth = 5;
		goban.globalAlpha = 0.6;
		goban.beginPath();
		goban.arc(centerPoint[0], centerPoint[1], 2 * canvas.width / cameraWidth, 0, 2 * Math.PI);
		goban.stroke();
		goban.lineWidth = 1;
		goban.fillStyle = teamtoColor(currentTeam);
		goban.beginPath();
		goban.arc(centerPoint[0], centerPoint[1], 2 * canvas.width / cameraWidth, 0, 2 * Math.PI);
		goban.fill();
		goban.globalAlpha = 1;
	}
});
