import img from '../routes/next.jpg'
import s from './fr.module.scss'
import imgs from './image.png'

export function Card(){
    return(
        <main>
            <div class={s.container}>
                <img src={imgs} class={s.imgs}/>
                <div class={s.infoBox}>
                    <img src={img}></img>
                    <p>Nextoore</p>
                </div>
                <div class={s.playBox}>
                    <div class={s.box2}>
                        <img src={img}/>
                        <p>Brawl Stars</p>
                    </div>
                </div>
                </div>
        </main>
    )
}