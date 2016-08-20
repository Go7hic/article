import React from 'react'
import moment from 'moment'
import { RouteHandler, Link } from 'react-router'
import DocumentTitle from 'react-document-title'
import { prefixLink } from 'gatsby-helpers'
import access from 'safe-access'
import { config } from 'config'
import ReadNext from '../ReadNext'
import './style.css'
import '../../static/css/highlight.css'

class SitePost extends React.Component {
  render() {
    const { route } = this.props
    const post = route.page.data
    const home = (
      <div>
        <Link className="gohome" to={prefixLink('/') }> Home
        </Link>
      </div>
    )

    return (
      <div>
        { home }
        <div className="blog-single">
          <div className="text">
            <h1>{ post.title }</h1>
            <p style={{ textAlign: "center" }}>
              <time dateTime={ moment(post.datePublished).format('YYYY-MM-DD') }>
                时间：{ moment(post.datePublished).format('YYYY-MM-DD') }
              </time>
              <span style={ { padding: '5px' } }></span>
              <span className='blog-category'>分类：{ post.category }</span>
            </p>
            <div dangerouslySetInnerHTML={{ __html: post.body }} />

          </div>
          <div className="footer">
            <ReadNext post={post} {...this.props} />
            <hr></hr>
          </div>
        </div>
      </div>
    )
  }
}

SitePost.propTypes = {
  post: React.PropTypes.object.isRequired,
  pages: React.PropTypes.array,
}

export default SitePost
