export type Engine = 'bohr' | 'scattering' | 'blackbody' | 'photoelectric' | 'matter' | 'orbital';
export interface Topic {
  id: string;
  part: number;
  title: string;
  english: string;
  description: string;
  priority: '核心' | '支撑';
  engine?: Engine;
  equation: string;
  principle: string;
  evidence: string;
  limitation: string;
  history: string;
  related: string[];
}
export const parts = [
  {
    id: 1,
    numeral: 'I',
    label: 'ATOMIC STRUCTURE',
    title: '原子结构与核式模型',
    question: '原子的内部，究竟是什么？',
    description: '从电子的发现出发，用散射实验揭开原子内部的结构。',
    color: 'green',
  },
  {
    id: 2,
    numeral: 'II',
    label: 'QUANTIZATION',
    title: '量子化与原子能态',
    question: '为什么能量只能取某些值？',
    description: '探索分立能级、电子跃迁，以及原子独特的光谱指纹。',
    color: 'rust',
  },
  {
    id: 3,
    numeral: 'III',
    label: 'QUANTUM MECHANICS',
    title: '量子力学初步',
    question: '当粒子也拥有波的性质。',
    description: '从物质波走向波函数，以概率重新理解微观世界。',
    color: 'blue',
  },
];
export const topics: Topic[] = [
  {
    id: 'electrons',
    part: 1,
    title: '电子与原子组成',
    english: 'Electrons & atomic constituents',
    priority: '支撑',
    description: '阴极射线如何揭示一种普遍存在的带负电粒子？',
    equation: 'F = q(E + v × B)',
    principle:
      '阴极射线在电场与磁场中偏转。电荷的符号由偏转方向确定，电荷与质量的比值可由已知场强和运动轨迹推断。电中性原子含有等量正、负电荷。',
    evidence: '阴极射线实验：改变电极材料仍得到相同的荷质比，支持电子是物质的共同组成部分。',
    limitation: '荷质比测量本身不能分别给出电子电荷与质量。本页不提供带电粒子仪器的定量模拟。',
    history: 'J. J. Thomson 在 1897 年通过阴极射线研究建立了电子的实验依据。',
    related: ['thomson', 'rutherford'],
  },
  {
    id: 'thomson',
    part: 1,
    title: '汤姆孙原子模型',
    english: 'Thomson atomic model',
    priority: '支撑',
    description: '正电荷弥散分布、电子嵌入其中的早期原子图景。',
    equation: 'Q_positive + Q_electrons = 0',
    principle:
      '汤姆孙模型把正电荷看作分布在原子尺度上的连续背景，负电子嵌在其中，使整个原子电中性。',
    evidence:
      '模型回应了电子发现后的原子结构问题，但弥散的正电荷难以解释金箔实验中少量粒子的大角度散射。',
    limitation: '这是历史模型，不能给出正确的核式结构或原子线状光谱。',
    history: '通常称为“葡萄干布丁模型”，它是核式原子模型提出前的重要尝试。',
    related: ['electrons', 'rutherford'],
  },
  {
    id: 'rutherford',
    part: 1,
    title: '卢瑟福散射',
    english: 'Rutherford scattering',
    priority: '核心',
    engine: 'scattering',
    description: '改变碰撞参数，观察 α 粒子如何被原子核偏转。',
    equation: 'θ = 2 arctan[k / (2Eb)]',
    principle:
      '带正电的 α 粒子与带正电的原子核通过库仑力相互排斥。碰撞参数 b 越小，粒子越接近核，偏转越明显。大多数粒子远离极小的原子核，因而只发生小角度偏转。',
    evidence:
      '金箔实验观察到多数 α 粒子通过、少量显著偏转，极少数甚至向后散射，为集中正电荷的核式结构提供证据。这里展示的是理论轨迹，不是实验测量。',
    limitation:
      '固定点核、单次非相对论库仑散射；不计反冲、电子屏蔽和核力。极小 b 是点库仑模型的外推；核标记被放大。',
    history: '盖革与马斯登的散射实验促成了卢瑟福在 1911 年提出核式原子模型。',
    related: ['thomson', 'classical', 'bohr'],
  },
  {
    id: 'classical',
    part: 1,
    title: '经典原子模型的局限',
    english: 'Limits of classical atoms',
    priority: '支撑',
    description: '加速运动的电子为什么会引出原子稳定性问题？',
    equation: 'P = e²a² / (6πε₀c³)',
    principle:
      '经典电磁理论预言加速电荷会辐射能量。若把电子理解为绕核做圆周运动的经典粒子，它会损失机械能，轨道无法保持稳定。',
    evidence:
      '真实原子能够稳定存在，且辐射呈现离散谱线。这些事实超出了简单经典轨道模型的解释能力。',
    limitation:
      '拉莫尔公式适用于非相对论点电荷。本页说明经典模型的矛盾，不把“螺旋坠核”动画当作真实原子的行为。',
    history: '原子稳定性与线状光谱问题是早期量子理论的重要动机。',
    related: ['rutherford', 'bohr'],
  },
  {
    id: 'blackbody',
    part: 2,
    title: '黑体辐射',
    english: 'Blackbody radiation',
    priority: '支撑',
    engine: 'blackbody',
    description: '升高温度，寻找辐射曲线的峰值与经典理论的边界。',
    equation: 'Bλ = (2hc²/λ⁵) / [exp(hc/λkBT) − 1]',
    principle:
      '理想黑体的平衡辐射谱只取决于温度。普朗克引入能量量子化后得到有限的短波辐射，而经典瑞利–金斯定律只在长波极限有效。',
    evidence:
      '黑体辐射测量呈现有限峰值。图中两条曲线均为理论预测，不是实验数据。升高温度会使峰值移向短波，并提高谱辐亮度。',
    limitation:
      '理想平衡黑体、发射率为 1。纵轴为单位微米的谱辐亮度；超出坐标上限的经典曲线被裁切。',
    history: '普朗克在 1900 年提出能量交换量子化，以解释黑体辐射谱。',
    related: ['photoelectric', 'bohr'],
  },
  {
    id: 'photoelectric',
    part: 2,
    title: '光电效应',
    english: 'Photoelectric effect',
    priority: '支撑',
    engine: 'photoelectric',
    description: '调节波长与光强，分清电子的动能和发射数量。',
    equation: 'Kmax = hf − φ',
    principle:
      '单个光子把能量 hf 交给电子；电子克服逸出功 φ 后，剩余能量成为动能。光子能量不足时，提高光强也不会在单光子模型中产生正动能光电子。',
    evidence:
      '光电效应的截止频率与遏止电压关系支持光的粒子性。此处为理想单光子示意，不包含实验测量电流。',
    limitation:
      '发射数量仅为相对示意，不能解读为安培数。忽略材料谱响应、热效应、空间电荷及多光子过程。',
    history: '爱因斯坦在 1905 年用光量子解释光电效应。',
    related: ['blackbody', 'duality', 'transitions'],
  },
  {
    id: 'bohr',
    part: 2,
    title: '玻尔原子模型',
    english: 'The Bohr model',
    priority: '核心',
    engine: 'bohr',
    description: '探索量子化轨道，连接原子能级与光子的能量。',
    equation: 'En = −hcR∞Z²/n²   ·   rn = a₀n²/Z',
    principle:
      '玻尔假设电子只处在特定定态，角动量满足 mvr = nℏ。不同定态之间的能量差通过吸收或发射光子交换。核电荷数 Z 增大时，能级按 Z² 变深，轨道半径按 1/Z 缩小。',
    evidence:
      '氢原子线状光谱提供能级差的观测依据。玻尔模型能解释主要谱线位置，但不能完整描述谱线强度与精细结构。',
    limitation:
      '无限核质量、单电子、非相对论模型。不计精细结构和选择定则。图中轨道半径经过压缩，动画速度为示意；经典轨道不是量子轨道。',
    history: '玻尔于 1913 年把量子条件引入核式原子模型。',
    related: ['rutherford', 'hydrogen-like', 'transitions', 'orbitals'],
  },
  {
    id: 'hydrogen-like',
    part: 2,
    title: '类氢原子与离子',
    english: 'Hydrogen-like systems',
    priority: '核心',
    engine: 'bohr',
    description: '比较 H、He⁺ 与 Li²⁺，观察核电荷如何改变单电子体系。',
    equation: 'En ∝ −Z²/n²   ·   rn ∝ n²/Z',
    principle:
      '类氢体系只有一个电子：氢、氦离子 He⁺、锂离子 Li²⁺。它们共享库仑势模型，但核电荷改变束缚能与长度尺度。He⁺ 的同一 n 能量是氢的四倍深，半径是氢的一半。',
    evidence: '单电子离子的光谱随核电荷改变。本工作台可直接比较相同跃迁的能量与真空波长。',
    limitation: '不适用于中性氦或中性锂等多电子原子。这里忽略有限核质量与相对论修正。',
    history: '类氢体系把玻尔模型从氢推广到其他单电子库仑系统。',
    related: ['bohr', 'sommerfeld', 'spectroscopy'],
  },
  {
    id: 'sommerfeld',
    part: 2,
    title: '玻尔–索末菲模型',
    english: 'Bohr–Sommerfeld extension',
    priority: '核心',
    description: '从圆形轨道到作用量量子化，理解旧量子论的推广。',
    equation: '∮ pᵢ dqᵢ = nᵢh',
    principle:
      '旧量子论把量子化条件施加到周期运动的作用量上，允许分别处理径向和角向运动。索末菲引入椭圆轨道与相对论修正，尝试解释氢谱的精细结构。',
    evidence: '这一扩展改善了部分光谱描述，却没有形成普适一致的微观理论。',
    limitation:
      '课程中“玻尔模型推广”的具体数学深度仍需讲义确认。本页提供概念入口，不提供尚未定义规格的椭圆轨道求解器。',
    history: '这一模型是从玻尔理论走向现代量子力学的重要过渡。',
    related: ['hydrogen-like', 'schrodinger', 'orbitals'],
  },
  {
    id: 'transitions',
    part: 2,
    title: '原子能级跃迁',
    english: 'Atomic transitions',
    priority: '核心',
    engine: 'bohr',
    description: '选取初末能级，让能量守恒变成可观察的光谱。',
    equation: 'Ephoton = |Ef − Ei| = hf = hc/λ',
    principle:
      '向较低能级跃迁释放能量并发射光子；向较高能级跃迁需要吸收匹配能量的光子。初末态共同决定频率，而不是电子在轨道动画中运动的速度。',
    evidence:
      '光谱线的位置对应原子能态之间的差值。选择 3 → 2 可观察玻尔模型下的 Balmer 系列第一条线。',
    limitation:
      '只根据主量子数计算能量匹配，不代表所有微观跃迁都满足电偶极选择定则。未模拟跃迁寿命和谱线强度。',
    history: '能级差与光子频率的关系把原子内部结构和宏观光谱观测联系起来。',
    related: ['bohr', 'spectroscopy', 'franck-hertz'],
  },
  {
    id: 'spectroscopy',
    part: 2,
    title: '原子光谱',
    english: 'Atomic spectroscopy',
    priority: '核心',
    engine: 'bohr',
    description: '从 Lyman 到 Paschen，在谱线中读出原子能级。',
    equation: '1/λ = R∞Z²(1/nf² − 1/ni²)',
    principle:
      '发射谱线由向低能级跃迁产生。相同末态构成光谱系列：Lyman 到 n=1，Balmer 到 n=2，Paschen 到 n=3，Brackett 到 n=4。',
    evidence:
      '实验中的氢原子光谱是分立的。这里计算的是无限核质量约定下的理论真空波长，不能与测得的空气波长直接等同。',
    limitation:
      '线高不表示强度。不计有限核质量、展宽与精细结构。UV/IR 谱线不映射为虚构的可见颜色。',
    history: 'Balmer 和 Rydberg 的经验规律先于其完整量子理论解释。',
    related: ['transitions', 'hydrogen-like', 'franck-hertz'],
  },
  {
    id: 'franck-hertz',
    part: 2,
    title: '弗兰克–赫兹实验',
    english: 'Franck–Hertz experiment',
    priority: '支撑',
    description: '通过电子与原子的非弹性碰撞，检验离散激发能。',
    equation: 'ΔE = eΔV ≈ 4.9 eV（汞的典型激发）',
    principle:
      '加速电子在达到一定能量后，可通过非弹性碰撞使原子激发，导致到达收集极的电流变化。重复出现的电流特征反映特定激发能，而不是任意能量转移。',
    evidence: '汞实验中约 4.9 V 的特征间隔与离散激发能有关。它是能量量子化的独立实验线索。',
    limitation:
      '实际电流曲线还受接触电势、温度、平均自由程和阻滞电压影响。本页不生成未经建模的电流曲线。',
    history: 'Franck 与 Hertz 于 1914 年开展电子碰撞实验。',
    related: ['transitions', 'spectroscopy'],
  },
  {
    id: 'duality',
    part: 3,
    title: '波粒二象性',
    english: 'Wave–particle duality',
    priority: '支撑',
    description: '不同实验中，微观对象如何表现波与粒子的特征？',
    equation: 'E = hf   ·   p = h/λ',
    principle:
      '干涉和衍射表现出波的特征，局域能量交换表现出粒子的特征。经典波或经典粒子图像都不能独立概括所有微观现象。',
    evidence: '光电效应说明光的粒子性，电子衍射支持物质的波动性。实验安排决定哪些特征可被观测。',
    limitation: '波粒二象性不意味着微观对象是在两种经典物体之间轮流切换。',
    history: '光与物质的互补实验性质推动了量子理论的发展。',
    related: ['photoelectric', 'matter-waves', 'wavefunction'],
  },
  {
    id: 'matter-waves',
    part: 3,
    title: '德布罗意物质波',
    english: 'De Broglie matter waves',
    priority: '核心',
    engine: 'matter',
    description: '改变电子动能，观察动量与物质波波长的关系。',
    equation: 'λ = h/p = h/√(2meE)',
    principle:
      '具有动量 p 的粒子对应德布罗意波长 h/p。在非相对论近似下，电子动能增大四倍，波长减为一半。圆周驻波条件 2πr=nλ 也能给出玻尔角动量量子条件。',
    evidence:
      'Davisson–Germer 实验中的电子衍射支持物质波假设。工作台的正弦曲线是相位示意，并非电子轨迹或概率分布。',
    limitation: '仅展示 10–200 eV 自由电子的非相对论波长。未模拟晶格散射或实验衍射强度。',
    history: '德布罗意于 1924 年提出物质波假设，随后得到电子衍射实验支持。',
    related: ['bohr', 'duality', 'schrodinger'],
  },
  {
    id: 'wavefunction',
    part: 3,
    title: '波函数与概率',
    english: 'Wave functions & probability',
    priority: '核心',
    description: '区分概率幅、概率密度与归一化条件。',
    equation: 'ρ = |ψ|²   ·   ∫|ψ|² dV = 1',
    principle:
      '波函数一般为复值概率幅。其模平方给出单位体积的概率密度，对空间区域积分得到在该区域发现粒子的概率。归一化确保总概率为 1。',
    evidence: '相同量子态的重复位置测量形成统计分布；单次测量不能直接画出完整波函数。',
    limitation:
      '波函数幅度与概率密度不是同一个量。径向概率还包含空间体积元素，不能直接读作三维概率密度。',
    history: 'Born 的概率解释建立了波函数与测量统计之间的联系。',
    related: ['matter-waves', 'schrodinger', 'orbitals'],
  },
  {
    id: 'schrodinger',
    part: 3,
    title: '薛定谔方程',
    english: 'The Schrödinger equation',
    priority: '核心',
    description: '从哈密顿量到定态，理解量子能态的数学来源。',
    equation: 'iℏ ∂ψ/∂t = Ĥψ   ·   Ĥψ = Eψ',
    principle:
      '含时方程描述量子态的演化。时间无关势下，求解哈密顿量本征值问题得到定态和对应能量。非相对论单粒子哈密顿量为 Ĥ=−ℏ²∇²/(2m)+V。',
    evidence: '氢原子库仑势的解给出能量本征值及空间波函数，与原子光谱和概率分布相联系。',
    limitation:
      '此处解释方程结构，尚未实现通用偏微分方程数值求解器。束缚态的离散性来自势与边界条件，并非所有解都是离散谱。',
    history: '薛定谔在 1926 年提出波动力学描述。',
    related: ['wavefunction', 'orbitals', 'sommerfeld'],
  },
  {
    id: 'orbitals',
    part: 3,
    title: '量子态与原子轨道',
    english: 'Quantum states & orbitals',
    priority: '核心',
    engine: 'orbital',
    description: '比较 1s、2s、2p 的径向分布，发现节点与概率峰。',
    equation: 'P(r) = r²|Rnl(r)|²   ·   ∫P(r)dr = 1',
    principle:
      '原子轨道由波函数描述，不是电子的运行路径。径向概率 P(r) 把各个方向的概率积分后，给出单位径向长度上的概率。2s 在 r=2a₀ 有一个径向节点；2p 没有正半径的径向节点。',
    evidence:
      '非相对论氢原子的解析波函数给出这里的分布。n 决定该近似下的能量，l 与 m 描述其他空间性质。',
    limitation:
      '图中为角度积分后的径向概率，不是三维电子云、角向分布或 |ψ|²。只提供氢的 1s、2s、2p；横轴截到 20a₀。',
    history: '现代轨道图景以量子态与概率取代旧量子论的确定轨道。',
    related: ['wavefunction', 'schrodinger', 'bohr'],
  },
];
export const relationships = [
  {
    from: 'rutherford',
    to: 'bohr',
    label: '模型发展',
    note: '核式结构与稳定性问题推动量子化模型。',
  },
  { from: 'bohr', to: 'hydrogen-like', label: '模型推广', note: '将单电子模型推广到不同核电荷。' },
  { from: 'bohr', to: 'transitions', label: '理论预测', note: '分立能态决定跃迁的光子能量。' },
  { from: 'transitions', to: 'spectroscopy', label: '现象解释', note: '用能级差理解分立光谱线。' },
  {
    from: 'matter-waves',
    to: 'schrodinger',
    label: '理论发展',
    note: '物质波通向波函数的动力学描述。',
  },
  {
    from: 'schrodinger',
    to: 'orbitals',
    label: '数学基础',
    note: '库仑势中的定态解给出原子轨道。',
  },
  { from: 'bohr', to: 'orbitals', label: '概念比较', note: '经典式轨道与量子概率分布并不等价。' },
];
