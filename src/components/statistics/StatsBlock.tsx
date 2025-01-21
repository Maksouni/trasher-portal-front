import { ReactNode } from 'react'
import './styles.scss'

interface StatsBlockProps{
  icon: ReactNode;
  title: string;
  value: string
}

export default function StatsBlock({icon, title, value} : StatsBlockProps){
  return(
    <div className="stats-block">
      {icon}
      <h2>{value}</h2>
      <p>{title}</p>
    </div>
  )
}