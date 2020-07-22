import Minesweeper from './visualizations/minesweeper'
import HighSchoolClock from './visualizations/high-school-clock'
import markdownStyles from './markdown-styles.module.css'
import Markdown from '../lib/markdown'

export default function PostBody({ post }) {
  return (
    <div className='max-w-2xl mx-auto'>
      {post.slug === 'minesweeper' && <Minesweeper />}
      {post.slug === 'high-school-clock' && <HighSchoolClock />}
      <Markdown className={markdownStyles['markdown']} source={post.content} />
    </div>
  )
}
