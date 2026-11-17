import type { QuantityId } from '../physics/rutherford/types';

export interface DerivationStep {
  title: string;
  tex: string;
  operation: string;
  algebra: string;
  highlight: QuantityId;
}
export const scatteringFormula = String.raw`\tan\frac{[[scattering-angle:\theta]]}{2}=\frac{\kappa}{2[[energy:E]][[impact-parameter:b]]}=\frac{a}{[[impact-parameter:b]]}`;
export const vectorRoute: DerivationStep[] = [
  {
    title: '牛顿方程：积分的是矢量',
    tex: String.raw`m\frac{d[[velocity:\mathbf v]]}{dt}=[[force:\mathbf F]]=\frac{\kappa}{[[distance:r]]^2}\hat{\mathbf r}`,
    operation: '先写力的大小和方向；r̂ 随粒子位置改变。',
    algebra: String.raw`\hat{\mathbf r}=(\cos\phi,\sin\phi),\qquad \mathbf v_i=v_\infty(1,0)`,
    highlight: 'force',
  },
  {
    title: '角动量把时间换成极角',
    tex: String.raw`\dot\phi=-\frac{[[angular-momentum:L]]}{m[[distance:r]]^2},\qquad dt=-\frac{mr^2}{L}\,d\phi`,
    operation: '入射线 y=b>0，所以 φ 递减、Lz 为负；L 表示大小。',
    algebra: String.raw`L_z=m(xv_y-yv_x)=-mv_\infty b=-L`,
    highlight: 'angular-momentum',
  },
  {
    title: '代入 dt，消去 r²',
    tex: String.raw`d[[velocity:\mathbf v]]=\frac{\kappa}{mr^2}\hat{\mathbf r}\left(-\frac{mr^2}{[[angular-momentum:L]]}\,d\phi\right)=-\frac{\kappa}{L}\hat{\mathbf r}\,d\phi`,
    operation: '把上一步的 dt 代入牛顿方程；m 与 r² 分别约去。',
    algebra: String.raw`\frac{\kappa}{\cancel{m}\cancel{r^2}}\left(-\frac{\cancel{m}\cancel{r^2}}{L}\right)=-\frac{\kappa}{L}`,
    highlight: 'force',
  },
  {
    title: '分量与积分方向',
    tex: String.raw`d\mathbf v=-\frac{\kappa}{L}(\cos\phi,\sin\phi)\,d\phi,\qquad\phi:\pi\longrightarrow[[scattering-angle:\theta]]`,
    operation: '分别积分 x、y 分量，不能用标量力积分代替整个矢量冲量。',
    algebra: String.raw`dv_x=-\frac\kappa L\cos\phi\,d\phi,\qquad dv_y=-\frac\kappa L\sin\phi\,d\phi`,
    highlight: 'velocity',
  },
  {
    title: '累积速度变化',
    tex: String.raw`\Delta[[velocity:\mathbf v]]=-\frac\kappa L\int_\pi^\theta(\cos\phi,\sin\phi)\,d\phi=\frac\kappa L(-\sin\theta,1+\cos\theta)`,
    operation: '在速度空间，∆v 从入射速度端点连到当前速度端点。图中的当前端点尚不一定到达无穷远。',
    algebra: String.raw`\int_\pi^\theta\cos\phi\,d\phi=\sin\theta,\qquad\int_\pi^\theta\sin\phi\,d\phi=-1-\cos\theta`,
    highlight: 'velocity',
  },
  {
    title: '匹配渐近速度，得到偏转角',
    tex: scatteringFormula,
    operation: '用最终速度差的 y 分量，结合半角恒等式；不把有限距离的速度当作渐近速度。',
    algebra: String.raw`v_\infty\sin\theta=\frac\kappa L(1+\cos\theta)\Rightarrow\frac{\sin\theta}{1+\cos\theta}=\frac\kappa{Lv_\infty}=\frac\kappa{2Eb}`,
    highlight: 'scattering-angle',
  },
];
export const radialRoute: DerivationStep[] = [
  {
    title: '能量分成径向与角向部分',
    tex: String.raw`[[energy:E]]=\frac12m\dot r^2+V_{\rm eff}(r),\quad V_{\rm eff}=\frac\kappa{[[distance:r]]}+\frac{[[angular-momentum:L]]^2}{2mr^2}`,
    operation: '由 v²=ṙ²+r²φ̇²，用角动量守恒消去 φ̇。',
    algebra: String.raw`\tfrac12 mr^2\dot\phi^2=\frac{L^2}{2mr^2}`,
    highlight: 'energy',
  },
  {
    title: '找到径向转折点',
    tex: String.raw`E=V_{\rm eff}([[closest-approach:r_{\min}]]),\quad r_{\min}=a+\sqrt{a^2+b^2}`,
    operation: '最近处 ṙ=0；切向速度一般不为零。rmin 不是入射线到核的距离 b。',
    algebra: String.raw`Er_{\min}^2-\kappa r_{\min}-\frac{L^2}{2m}=0\quad\xrightarrow{L^2=2mEb^2}\quad r_{\min}=a+\sqrt{a^2+b^2}`,
    highlight: 'closest-approach',
  },
  {
    title: '在出射支路取正的径向速度',
    tex: String.raw`\Phi=\int_{r_{\min}}^\infty\frac{L\,dr}{r^2\sqrt{2m[E-\kappa/r-L^2/(2mr^2)]}}`,
    operation:
      '出射支路 ṙ>0，把 |dφ/dr| 积分为半边极角扫过量。下限的平方根奇点可积，不能直接当作有限函数值绘制。',
    algebra: String.raw`\dot r=+\sqrt{\frac2m(E-V_{\rm eff})},\qquad\left|\frac{d\phi}{dr}\right|=\frac{L}{mr^2\dot r}`,
    highlight: 'distance',
  },
  {
    title: '变量替换 u = 1/r',
    tex: String.raw`\Phi=\int_0^{1/r_{\min}}\frac{b\,du}{\sqrt{1-2au-b^2u^2}}`,
    operation:
      'dr/r²=−du；交换积分上下限消去负号，再用 L=√(2mE)b。这里的积分变量 u 与画布的双曲参数不是同一个量。',
    algebra: String.raw`\frac{L}{\sqrt{2mE}}=b,\qquad\frac\kappa E=2a`,
    highlight: 'angular-momentum',
  },
  {
    title: '配方后计算反正弦积分',
    tex: String.raw`\Phi=\left[\arcsin\frac{bu+a/b}{\sqrt{1+(a/b)^2}}\right]_0^{1/r_{\min}}=\arctan\frac ba`,
    operation: '令 w=bu+a/b；上限对应根号为零的转折点。此步要求 b>0。',
    algebra: String.raw`1-2au-b^2u^2=1+(a/b)^2-(bu+a/b)^2,\quad\Phi=\frac\pi2-\arcsin\frac a{\sqrt{a^2+b^2}}`,
    highlight: 'impact-parameter',
  },
  {
    title: '用轨迹对称性还原 θ',
    tex: scatteringFormula,
    operation: '两侧极角扫过相同，所以 2Φ=π−θ；这不是把位置角 φ 直接等同为散射角。',
    algebra: String.raw`[[scattering-angle:\theta]]=\pi-2\arctan\frac ba\quad\Rightarrow\quad\tan\frac\theta2=\frac ab=\frac\kappa{2Eb}`,
    highlight: 'scattering-angle',
  },
];
export const mechanicsPreview = String.raw`\mathcal L=\tfrac12m(\dot r^2+r^2\dot\phi^2)-\frac\kappa r,\quad\frac d{dt}\frac{\partial\mathcal L}{\partial\dot\phi}=\frac{\partial\mathcal L}{\partial\phi}=0`;
