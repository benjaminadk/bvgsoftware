import markdownStyles from './markdown-styles.module.css'
import Markdown from '../lib/markdown'

export default function PostBody({ content }) {
  return (
    <div className='max-w-2xl mx-auto'>
      <Markdown className={markdownStyles['markdown']} source={content} />
    </div>
  )
}
