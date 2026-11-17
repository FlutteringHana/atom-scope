import type { QuantityId } from '../physics/rutherford/types';

export const quantityNames: Record<QuantityId, [string, string, string, string]> = {
  energy: [
    'E',
    '入射动能',
    'α 粒子在无穷远处的动能，并非当前局部动能。',
    'E = ½mv∞²；改变它会同时改变轨迹和截面。',
  ],
  'nuclear-charge': [
    'Z',
    '核电荷数',
    '靶核带电量为 +Ze；α 粒子的 z 固定为 2。',
    'κ = 2Ze²/(4πε₀)，固定重核近似。',
  ],
  'impact-parameter': [
    'b',
    '碰撞参数',
    '核到入射渐近直线的垂直距离，不是最近核距离。',
    '入射线 y=b；也可由 b=a cot(θ/2) 计算。',
  ],
  'scattering-angle': [
    'θ',
    '偏转角',
    '渐近入射与出射速度之间的夹角；不是极位置角 φ。',
    'θ = 2 atan2(a,b)，b=0 时 θ=180°。',
  ],
  distance: [
    'r',
    '当前核距离',
    '当前粒子位置到核的距离，会随轨道参数变化。',
    'r = √(x²+y²)；检查位置向量。',
  ],
  'closest-approach': [
    'rmin',
    '最近核距离',
    '径向运动的转折点；径向速度为零。',
    'rmin = a + √(a²+b²)，由 E=Veff 解出。',
  ],
  force: [
    'F',
    '当前库仑力',
    '始终沿核指向 α 粒子的方向，而非固定朝向。',
    'F = κ/r²；图中箭头长度为方向示意。',
  ],
  velocity: [
    'v',
    '当前速率',
    '速度矢量与当前轨迹相切；速率小于无穷远值。',
    'v = |d𝐫/dt|，由解析轨迹和 dt/du 求得。',
  ],
  'angular-momentum': [
    'L',
    '角动量大小',
    '显示大小 L≥0；本坐标中带符号的 Lz=−L。',
    'L = mv∞b = |m(xvy−yvx)|，沿轨迹守恒。',
  ],
  'solid-angle': [
    'ΔΩ',
    '接受立体角',
    '描述出射方向的空间范围，单位 sr，不是平面角。',
    '环带为 2π(cosθ₁−cosθ₂)；面元由 ΔΩ 指定。',
  ],
  'differential-cross-section': [
    'dσ/dΩ',
    '微分截面',
    '每单位立体角的有效散射面积，不是单粒子的一段长度。',
    'dσ/dΩ = a²/[4 sin⁴(θ/2)]，图中按当前检查角读取。',
  ],
  'bin-cross-section': [
    'σaccept',
    '接受截面',
    '选定探测器方向范围对应的有效入射面积。',
    '环带为精确积分；小面元使用中心值乘 ΔΩ 的近似。',
  ],
  'target-areal-density': [
    'nₜ',
    '靶面密度',
    '单位靶面积上的核数，不是体积密度或几何厚度。',
    '这里直接输入核数/m²；未假定具体材料密度。',
  ],
  probability: [
    'P',
    '单粒子事件概率',
    '一颗入射 α 粒子散射进入接受区的薄靶概率。',
    'P≈nₜσaccept；不含 η。超出薄靶范围时不报告为有效概率。',
  ],
  'detector-count': [
    '𝔼[Ndet]',
    '预期探测计数',
    '多次重复实验的平均预测，与一次随机观测不同。',
    '𝔼[Ndet]=N₀Pη；随机计数单独从 Poisson 分布抽样。',
  ],
};
