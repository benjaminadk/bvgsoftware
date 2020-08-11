import Minesweeper from './visualizations/minesweeper'
import HighSchoolClock from './visualizations/high-school-clock'
import SimpleBinarySearchTree from './visualizations/simple-binary-search-tree'
import Covid19DeathsByAgeGroup from './visualizations/covid-19-deaths-by-age-group'
import Covid19PandemicTimelapseChoropleth from './visualizations/covid-19-pandemic-timelapse-choropleth'
import markdownStyles from './markdown-styles.module.css'
import Markdown from '../lib/markdown'

export default function PostBody({ post }) {
  return (
    <div className='max-w-2xl mx-auto'>
      {post.slug === 'minesweeper' && <Minesweeper />}
      {post.slug === 'high-school-clock' && <HighSchoolClock />}
      {post.slug === 'simple-binary-search-tree' && <SimpleBinarySearchTree />}
      {post.slug === 'covid-19-deaths-by-age-group' && (
        <Covid19DeathsByAgeGroup />
      )}
      {post.slug === 'covid-19-pandemic-timelapse-choropleth' && (
        <Covid19PandemicTimelapseChoropleth />
      )}
      <Markdown className={markdownStyles['markdown']} source={post.content} />
    </div>
  )
}
