import css from './css/index.css';
import less from './css/black.less';
import sass from './css/bb.scss';
import jsp from './jsp.js';
//import $ from 'jquery';

{
  let jsString="Hello Webpack!!! Hello Life!!!"
  document.getElementById("title").innerHTML= jsString;
}
// jsp();
$('#title').html('Hello Moto');

var json = require("../config.json");
document.getElementById("json").innerHTML = json.name+":website="+json.webSite;
