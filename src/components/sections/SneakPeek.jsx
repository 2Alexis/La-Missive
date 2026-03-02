import ScrollReveal from '../animations/ScrollReveal';
import AdSense from './AdSense';
import './SneakPeek.css';

export default function SneakPeek() {
    return (
        <section className="sneak-peek section-padding" id="sneak-peek">
            <div className="container">
                <ScrollReveal>
                    <h2 className="section-title">Un aperçu de la dernière édition</h2>
                </ScrollReveal>

                <div className="sneak-peek__grid">
                    <ScrollReveal className="sneak-peek__main" delay={0.1}>
                        <div className="sneak-peek__envelope">
                            <div className="sneak-peek__card sneak-peek__card--back">
                                <div className="sneak-peek__card-header">
                                    <span className="sneak-peek__edition">Édition #47</span>
                                    <span className="sneak-peek__date">28 Février 2026</span>
                                </div>
                            </div>
                            <div className="sneak-peek__card sneak-peek__card--front">
                                <div className="sneak-peek__card-header">
                                    <div className="sneak-peek__logo-mini">LM</div>
                                    <span className="sneak-peek__edition">Édition #48</span>
                                </div>
                                <h3 className="sneak-peek__card-title">
                                    La semaine en 5 idées
                                </h3>
                                <div className="sneak-peek__card-content">
                                    <div className="sneak-peek__item">
                                        <span className="sneak-peek__number">01</span>
                                        <div>
                                            <strong>Le paradoxe de la productivité</strong>
                                            <p>Pourquoi travailler moins pourrait vous rendre plus créatif…</p>
                                        </div>
                                    </div>
                                    <div className="sneak-peek__item">
                                        <span className="sneak-peek__number">02</span>
                                        <div>
                                            <strong>L'IA comme collaborateur créatif</strong>
                                            <p>Comment les studios de design réinventent leur workflow…</p>
                                        </div>
                                    </div>
                                    <div className="sneak-peek__item">
                                        <span className="sneak-peek__number">03</span>
                                        <div>
                                            <strong>La typographie cinétique explose</strong>
                                            <p>Le mouvement comme nouveau langage visuel…</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="sneak-peek__card-footer">
                                    <span>Lire la suite dans votre boîte mail →</span>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                    <div className="sneak-peek__sidebar">
                        <ScrollReveal delay={0.3}>
                            <AdSense adSlot="SLOT_SIDEBAR" adFormat="rectangle" className="adsense--sidebar" />
                        </ScrollReveal>
                    </div>
                </div>
            </div>
        </section>
    );
}
