import { ArrowRight, Brain, BookOpen, Calculator, FlaskConical, Globe2, Landmark, Gamepad2 } from 'lucide-react';
import { Link } from 'react-router-dom';
const iconMap = { 'General Knowledge': Brain, 'Science & Nature': FlaskConical, Science: FlaskConical, Mathematics: Calculator, History: Landmark, Geography: Globe2, 'Video Games': Gamepad2, 'Entertainment: Video Games': Gamepad2 };
const tones = ['blue','green','purple','amber','sky','pink'];
export function CategoryCard({c,index=0}){
  const I=c.icon && typeof c.icon !== 'string' ? c.icon : (iconMap[c.name] || BookOpen);
  const toneName=c.tone||tones[index%tones.length];
  const styles={
    blue:{iconBg:'bg-[#eaf4ff]',iconText:'text-[#1f70ed]',border:'border-[#cfe1f7]',cardBg:'bg-[#eef6ff]'},
    green:{iconBg:'bg-[#eafaf2]',iconText:'text-[#1da465]',border:'border-[#cbe8d9]',cardBg:'bg-[#effbf5]'},
    purple:{iconBg:'bg-[#f1edff]',iconText:'text-[#7444ef]',border:'border-[#ded5f8]',cardBg:'bg-[#f5f1ff]'},
    amber:{iconBg:'bg-[#fff7e6]',iconText:'text-[#f2a30d]',border:'border-[#efdfb8]',cardBg:'bg-[#fff9ec]'},
    sky:{iconBg:'bg-[#edf7ff]',iconText:'text-[#2570e7]',border:'border-[#d1e6f7]',cardBg:'bg-[#f0f8ff]'},
    pink:{iconBg:'bg-[#fff0f4]',iconText:'text-[#f04f78]',border:'border-[#efd3dc]',cardBg:'bg-[#fff3f6]'},
  }[toneName] || {iconBg:'bg-[#eef4ff]',iconText:'text-[#5361ff]',border:'border-[#dbe6f6]',cardBg:'bg-[#f3f7ff]'};
  return <Link to={`/quiz/${c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}`} className={`group flex min-h-[158px] flex-col items-center justify-center rounded-2xl border ${styles.border} ${styles.cardBg} p-6 text-center shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-card`}>
    <div className={`grid h-16 w-16 place-items-center rounded-2xl ${styles.iconBg} ${styles.iconText} transition-transform duration-200 group-hover:scale-105`}><I size={30} strokeWidth={2.2}/></div>
    <h3 className="mt-4 text-[15px] font-extrabold leading-tight text-[#142d67]">{c.name}</h3>
  </Link>
}
export function FeaturedQuiz({c,index=0}){ const I=c.icon && typeof c.icon !== 'string' ? c.icon : (iconMap[c.name] || BookOpen); const bg=['bg-[#d9edff]','bg-[#dff8ec]','bg-[#e9e2ff]','bg-[#fff0ca]','bg-[#dcefff]'][index%5]; const href=`/quiz/${c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}`; return <div className="overflow-hidden rounded-xl border border-[#e0e8f6] bg-white shadow-card"><div className={`relative grid h-28 place-items-center ${bg}`}><div className="absolute left-4 top-4 rounded-md bg-[#5361ff] px-2 py-1 text-[10px] font-bold text-white">Live</div><I size={58} strokeWidth={1.6} className="opacity-80"/></div><div className="p-3"><div className="text-[11px] font-bold text-[#566fae]">{c.name}</div><h3 className="mt-1 min-h-[38px] text-[13px] font-bold leading-snug text-[#1a3067]">Fresh questions from the live quiz API.</h3><div className="mt-3 flex items-center justify-between text-[10px] text-[#7285ae]"><span>▣ 10 Questions</span><span className="font-bold text-[#f0a119]">Mixed</span></div><Link to={href} className="mt-3 flex h-8 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#4458ff] to-[#5a4ff4] text-xs font-bold text-white">Start Quiz <ArrowRight size={14}/></Link></div></div> }
