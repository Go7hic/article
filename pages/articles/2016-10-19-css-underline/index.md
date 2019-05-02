---
layout: post
title: CSS 实现下划线的几个姿势总结
datePublished: '2016-10-19 11:21:04'
category: CSS
---
下划线在我们的 web 设计里很常见，有些设计可能很特别，需要仔细思考用哪个方法才能实现最佳效果
```html
<h1>0.text-decoration: underline</h1>
<a href="" class="a0">下划线，woshiyiwnwen</a>

<h1>1.border-bottom</h1>
<a href="" class="a1">下划线，woshiyiwnwen</a>

<h2>2.伪元素的 border-bottom</h2>
<a href="" class="a2">下划线 woshiyinwei</a>

<h2>3. box-shadow</h2>
<a href="" class="a3">下划线 woshiyinwe</a>

<h2>4.背景线性渐变</h2>
<p><a href="" class="a4">下划线woshiyin</a></p>

<h2>5.svg filter</h2>
<p><a href="" class="a5">下划线woshiyin</a></p>
 
 <svg class="visuallyHidden">

  <!-- Base 0.0 to 1.0 values on the size of the bounding box.
       Essentially turn them into viewport units or percentages. -->
  <filter id="svg-underline" primitiveUnits="objectBoundingBox">
    
    <!-- Take the original image (the text) and expand it a little
         horizontally and a little more vertically. Then store it
         in a new layer. -->
    <feMorphology in="SourceGraphic" operator="dilate" radius="0.0075 0.05" result="outline"></feMorphology>
    
    <!-- Make a blue rectangle that’s 3% tall and 100% wide and expand it
         a little horizontally and a position it below the original text. -->
    <feFlood flood-color="blue" width="1" height="0.03" x="0" y="0.85" result="underline"></feFlood>
    
    <!-- Take the blue rectange and use the expanded text layer to mask
         out the parts we don’t want. This is where it skips descenders. -->
    <feComposite in="underline" in2="outline" operator="out" result="underline"></feComposite>
    
    <!-- Now stack the underline and the original text for export. -->
    <feMerge>
      <feMergeNode in="underline"></feMergeNode>
      <feMergeNode in="SourceGraphic"></feMergeNode>
    </feMerge>
  </filter>
</svg>
```

```css
.a0 {
  text-decoration: underline;
  /* 仅Firfox,Safari 支持 */
  text-decoration-style: dotted;
  text-decoration-color: red;
}
.a1 {
    text-decoration: none;
    border-bottom: 0.1em dashed #1AC63A;
    padding-bottom: .1em;
}
.a2 {

    display: inline-block;
    position: relative;
        text-decoration: none;
    
}
.a2::after {
    content: '';
    position: absolute;
    left: 0;
    display: inline-block;
    height: 1em;
    width: 100%;
    border-bottom: 1px solid;
    margin-top: 5px;
}
.a3 {
  text-decoration: none;
  box-shadow: 0 1px 0 0 currentColor;
}
.a4 {
     background-image: -webkit-linear-gradient(left, blue 75%, transparent 75%);
    background-image: linear-gradient(to right, blue 75%, transparent 75%);
    background-position: 0 15px;
    background-repeat: repeat-x;
    background-size: 8px 3px;
}
.a5 {
    -webkit-filter: url('#svg-underline');
    filter: url('#svg-underline');
    text-decoration: none;
}
```

在线 DEMO： jsfiddle.net/gothic/h5t8vzhj

