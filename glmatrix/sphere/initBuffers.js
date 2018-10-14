var triangleVertexPositionBuffer;

function initBuffers(shift) {
    triangleVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    // var vertices = [
    //   1.0,  1.0,  0.0 - shift,
    //   -1.0,  1.0,  0.0 - shift,
    //   1.0, -1.0,  0.0 - shift,
    //   -1.0, -1.0,  0.0 - shift
    // ];
    var vertices = [
      0.0, 0.0,  0.0,
      0.0, 1.0*Math.sin(shift),  0.0,
      1.0*Math.sin(shift), 0.0,  0.0,
      1.0*Math.sin(shift),  1.0*Math.sin(shift),  0.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    triangleVertexPositionBuffer.itemSize = 3;
    triangleVertexPositionBuffer.numItems = vertices.length / 3;

}
