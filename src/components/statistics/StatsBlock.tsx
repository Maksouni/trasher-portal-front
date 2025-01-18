import { ReactNode } from 'react'
import './styles.scss'

interface StatsBlockProps{
  icon: ReactNode;
  label: string
}

export default function StatsBlock({icon, label} : StatsBlockProps){
  return(
    <div className="stats-block">
      {icon}
      <p>{label}</p>
    </div>
  )
}