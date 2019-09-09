import React from 'react'
import { RouteHandler, Link } from 'react-router'
import { prefixLink } from 'gatsby-helpers'
import './style.css'

class SiteNav extends React.Component {
  componentDidMount() {
    var _hmt = _hmt || [];

    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?c3827e63853493a9fffae3721ae0712f";
    var s = document.getElementsByTagName("script")[0]; 
    s.parentNode.insertBefore(hm, s);
  }
  render() {
    const {location} = this.props
    return (
      <nav className='blog-nav'>
        <ul>
          <li>
            <Link to="/" className={ location.pathname === prefixLink('/') ? "current" : null }> Articles
            </Link>
          </li>
          <li>
            <Link to="/about" className={ location.pathname === prefixLink('/about') ? "current" : null }> About
            </Link>
          </li>
          <li>
            <Link to="/contact" className={ location.pathname === prefixLink('/contact') ? "current" : null }> Contact
            </Link>
          </li>
          <li>
            <Link to="/donate" className={ location.pathname === prefixLink('/donate') ? "current" : null }> Donate
            </Link>
          </li>
          <li>
            <Link to="/code" className={ location.pathname === prefixLink('/code') ? "current" : null }> Code
            </Link>
          </li>
        
          <li>
            <Link to="/links" className={ location.pathname === prefixLink('/links') ? "current" : null }> Links
            </Link>
          </li>
        </ul>
      </nav>
    );
  }
}

SiteNav.propTypes = {
  location: React.PropTypes.object,
}

export default SiteNav