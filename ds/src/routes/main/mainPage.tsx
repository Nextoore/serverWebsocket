import styles from './min.module.scss'
import next from '../next.jpg'
import {Card} from '../../components/friendCard'
export default function Login() {
  return (
    <div class={styles.App}>
      <header class = {styles.header}>
        <div class = {styles.logo}> <a href="/home"><img src={next} alt='' /></a></div>
        <div class = {styles.middleCont}>
          <div class={styles.cont}>
            <div class = {styles.icona}> <img src={next} alt="" /></div>
            <div class={styles.name}>Ne nightcore</div>
          </div>
        </div>
        <div class = {styles.profile}>
          <div class = {styles.icon}> <img src={next} alt="" /></div>
          
        </div>
      </header>
      <div class={styles.body}>
        <Card></Card>
      </div>
    </div>
  );
}