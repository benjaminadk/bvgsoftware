import { parseISO, format } from 'date-fns'
import cn from 'classnames'

export default function DateFormater({ dateString, color }) {
  const date = parseISO(dateString)
  return (
    <time
      className={cn('font-bold', {
        'text-link': color === 'pink'
      })}
      dateTime={dateString}
    >
      {format(date, 'LLLL	d, yyyy')}
    </time>
  )
}
