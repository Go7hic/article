/* eslint-disable */
import React from 'react'
import DocumentTitle from 'react-document-title'
import { prefixLink } from 'gatsby-helpers'
const BUILD_TIME = new Date().getTime()

module.exports = React.createClass({
  displayName: 'HTML',
  propTypes: {
    body: React.PropTypes.string,
  },
  componentDidMount() {

    var _hmt = _hmt || [];

    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?c3827e63853493a9fffae3721ae0712f";
    var s = document.getElementsByTagName("script")[0]; 
    s.parentNode.insertBefore(hm, s);


  },
  render () {
    const { body, route } = this.props
    const title = DocumentTitle.rewind()
   
    let css
    if (process.env.NODE_ENV === 'production') {
      css = <style dangerouslySetInnerHTML={{ __html: require('!raw!./public/styles.css') }} />
    }

    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0 maximum-scale=5.0" />
          <link rel="icon" type="image/x-icon" href="./static/img/favicon.ico" />
          <title>
            { title }
          </title>
          { css }
          
        </head>
        <body>
          <div id="react-mount" dangerouslySetInnerHTML={{ __html: this.props.body }} />
          <footer>
              <p className='copyright' style={{ textAlign: 'center' }}>
                &copy; 2016-2019 All rights reserved
              </p>
          </footer>
          <script src={prefixLink(`/bundle.js?t=${BUILD_TIME}`)} />
          
        </body>
      </html>
    )
  },
})
