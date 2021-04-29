mapboxgl.accessToken = 'pk.eyJ1IjoiY29kZWRyaXZlbiIsImEiOiJja20wdDIzY3oyOHA0Mm9zNWJmazhlOTMwIn0.8MntRE4biSPIUE8z6-odvQ';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/codedriven/ckm0u5lzw3qfy17lk7lbb1mdp', // style URL
    center: [-114.07116744127545, 51.01951879728364], // starting position [lng, lat]
    zoom:11 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

// add markers to map
geojson.features.forEach(function(marker) {
    // create a HTML element for each feature
    var el = document.createElement('div');
    el.className = 'marker';
    // make a marker for each feature and add to the map
    new mapboxgl.Marker(el).setLngLat(marker.geometry.coordinates).addTo(map); 
    new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setHTML('<h3><a href="' + marker.properties.website + '">' +  marker.properties.name + '</a></h3>' 
            + '<p>' + marker.properties.description + '</p>'
            + '<p><strong>Type: </strong>' + (marker.properties.type === "u" ? "University" : "College") +'<br />'
            + '<strong>Acceptance Rate: </strong>' + marker.properties.acceptance +'<br />'
            + '<strong>Enrollment: </strong>' + marker.properties.enrollment +'<br />'
            + '<strong>Total Programs: </strong>' + marker.properties.totalprograms +'<br />'
            + '<strong>Average program length: </strong>' + marker.properties.averageprogramlength +'<br />'
            + '<strong>Average cost: </strong>' + marker.properties.averagecost +' (CAD)</p>'))
        .addTo(map);
});

// Custom layer implemented as ES6 class
class NullIslandLayer {
    constructor() {
        this.id = 'null-island';
        this.type = 'custom';
        this.renderingMode = '3d';
    }

    onAdd(map, gl) {
        const vertexSource = `
        uniform mat4 u_matrix;
        void main() {
            gl_Position = u_matrix * vec4(0.5, 0.5, 0.0, 1.0);
            gl_PointSize = 20.0;
        }`;

        const fragmentSource = `
        void main() {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }`;

        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexSource);
        gl.compileShader(vertexShader);
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentSource);
        gl.compileShader(fragmentShader);

        this.program = gl.createProgram();
        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);
    }

    render(gl, matrix) {
        gl.useProgram(this.program);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.program, "u_matrix"), false, matrix);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}

map.on('load', function() {
    console.log('this is a test');
    map.addLayer(new NullIslandLayer());
});