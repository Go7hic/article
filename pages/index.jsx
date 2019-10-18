import React from 'react'
import { Link } from 'react-router'
import sortBy from 'lodash/sortBy'
import moment from 'moment'
import DocumentTitle from 'react-document-title'
import { prefixLink } from 'gatsby-helpers'
import access from 'safe-access'
import { config } from 'config'
import SitePost from '../components/SitePost'
import SiteSidebar from '../components/SiteSidebar'
// let pageLinks = []
let allPageLinks = []
class SiteIndex extends React.Component {
  constructor(prop) {
    super(prop);
  }

  componentDidMount() {
    window.location.href = 'https://yongyuan.us/blog/'
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
  }

  render() {
    // Sort pages.
    allPageLinks = [];
    const sortedPages = sortBy(this.props.route.pages, (page) => access(page, 'data.datePublished')
    ).reverse()
    const newSortedPages = [];
    sortedPages.map((page, index) => {
      if (access(page, 'file.ext') === 'md' && access(page, 'data.layout') === 'post') {
        newSortedPages.push(page);
      }
    })
    newSortedPages.map((page, index) => {
        const title = access(page, 'data.title') || page.path
        const description = access(page, 'data.description')
        const datePublished = access(page, 'data.datePublished')
        const category = access(page, 'data.category')
        allPageLinks.push(
           <div className='blog-post' key={index}>
              {/* <time dateTime={ moment(datePublished).format('MMMM D, YYYY') }>
                { moment(datePublished).format('MMMM YYYY') }
              </time>
              <span style={ { padding: '5px' } }></span>
              <span className='blog-category'>{ category }</span>
            */}
              <h2><Link style={ { borderBottom: 'none', } } to={ prefixLink(page.path) } > { title } </Link><time dateTime={ moment(datePublished).format('YYYY-MM-DD') }>
                { moment(datePublished).format('YYYY-MM-DD') }
              </time></h2>
              {/* <p dangerouslySetInnerHTML={ { __html: description } } /> */}
            </div>
        )
    })


    return (
      <DocumentTitle title={ config.siteTitle }>
        <div>
          <SiteSidebar {...this.props}/>
          <div className='content'>
            <div className='main'>
              <div className='main-inner'>
                { allPageLinks }
              </div>
            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}

SiteIndex.propTypes = {
  route: React.PropTypes.object,
}

export default SiteIndex
