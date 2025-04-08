import { useEffect, useRef, useState } from 'react';
import HanziWriter from 'hanzi-writer';

interface StrokeAnimationProps {
  character: string;
  strokeOrder: string;
}

const StrokeAnimation = ({ character, strokeOrder }: StrokeAnimationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<any>(null);
  const [currentStroke, setCurrentStroke] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [totalStrokes, setTotalStrokes] = useState(0);
  
  // 笔画颜色 - 使用适合小朋友的明亮颜色
  const strokeColors = [
    '#FF6B6B', // 红色
    '#4ECDC4', // 青色
    '#FFD166', // 黄色
    '#6A0572', // 紫色
    '#1A936F', // 绿色
  ];

  // 初始化汉字书写器
  useEffect(() => {
    if (!containerRef.current || !character) return;
    
    // 清除之前的实例
    if (writerRef.current) {
      writerRef.current = null;
    }
    
    // 清除容器内容
    containerRef.current.innerHTML = '';
    
    // 创建新的HanziWriter实例
    writerRef.current = HanziWriter.create(containerRef.current, character, {
      width: 200,
      height: 200,
      padding: 5,
      strokeColor: strokeColors[0],
      radicalColor: '#168F16', // 部首颜色
      delayBetweenStrokes: 300, // 笔画之间的延迟
      delayBetweenLoops: 1000, // 循环之间的延迟
      strokeAnimationSpeed: 1, // 笔画动画速度
      showOutline: false, // 不显示字的轮廓
      showCharacter: false, // 不显示完整的字
      strokeWidth: 8, // 笔画宽度
      // 自定义背景
      //background: '#FFFDE7', // 淡黄色背景
    });
    
    // 获取总笔画数
    if (writerRef.current) {
      const characterData = writerRef.current.getCharacterData();
      if (characterData && characterData.strokes) {
        const totalStrokes = characterData.strokes.length;
        setTotalStrokes(totalStrokes);
        setCurrentStroke(0);
        setIsComplete(false);
      }
    }
    
    // 添加网格辅助线
    addGridLines();
    
    // 添加参考字符
    addReferenceCharacter();
    
  }, [character]);
  
  // 添加网格辅助线
  const addGridLines = () => {
    if (!containerRef.current) return;
    
    const gridSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    gridSvg.setAttribute('width', '200');
    gridSvg.setAttribute('height', '200');
    gridSvg.style.position = 'absolute';
    gridSvg.style.top = '0';
    gridSvg.style.left = '0';
    gridSvg.style.pointerEvents = 'none';
    gridSvg.style.zIndex = '1';
    
    // 水平中线
    const horizontalLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    horizontalLine.setAttribute('x1', '0');
    horizontalLine.setAttribute('y1', '100');
    horizontalLine.setAttribute('x2', '200');
    horizontalLine.setAttribute('y2', '100');
    horizontalLine.setAttribute('stroke', 'rgba(200, 200, 200, 0.3)');
    horizontalLine.setAttribute('stroke-width', '1');
    
    // 垂直中线
    const verticalLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    verticalLine.setAttribute('x1', '100');
    verticalLine.setAttribute('y1', '0');
    verticalLine.setAttribute('x2', '100');
    verticalLine.setAttribute('y2', '200');
    verticalLine.setAttribute('stroke', 'rgba(200, 200, 200, 0.3)');
    verticalLine.setAttribute('stroke-width', '1');
    
    gridSvg.appendChild(horizontalLine);
    gridSvg.appendChild(verticalLine);
    
    containerRef.current.appendChild(gridSvg);
  };
  
  // 添加参考字符
  const addReferenceCharacter = () => {
    if (!containerRef.current) return;
    
    const referenceSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    referenceSvg.setAttribute('width', '200');
    referenceSvg.setAttribute('height', '200');
    referenceSvg.style.position = 'absolute';
    referenceSvg.style.top = '0';
    referenceSvg.style.left = '0';
    referenceSvg.style.pointerEvents = 'none';
    referenceSvg.style.zIndex = '0';
    
    const referenceText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    referenceText.setAttribute('x', '100');
    referenceText.setAttribute('y', '120');
    referenceText.setAttribute('font-size', '120');
    referenceText.setAttribute('text-anchor', 'middle');
    referenceText.setAttribute('fill', 'rgba(200, 200, 200, 0.3)');
    referenceText.setAttribute('font-weight', 'bold');
    referenceText.textContent = character;
    
    referenceSvg.appendChild(referenceText);
    containerRef.current.appendChild(referenceSvg);
  };

  // 播放动画
  const playAnimation = () => {
    if (!writerRef.current || isPlaying) return;
    
    setIsPlaying(true);
    setIsComplete(false);
    
    // 如果已经完成，重新开始
    if (currentStroke >= totalStrokes) {
      setCurrentStroke(0);
      writerRef.current.animateCharacter({
        onComplete: () => {
          setIsPlaying(false);
          setIsComplete(true);
          setCurrentStroke(totalStrokes);
          drawCompletionEffect();
        },
        onStrokeComplete: (strokeNum: number) => {
          setCurrentStroke(strokeNum + 1);
        }
      });
    } else {
      // 从当前笔画继续
      writerRef.current.resumeAnimation();
      
      // 监听笔画完成事件
      writerRef.current.animateCharacter({
        onComplete: () => {
          setIsPlaying(false);
          setIsComplete(true);
          setCurrentStroke(totalStrokes);
          drawCompletionEffect();
        },
        onStrokeComplete: (strokeNum: number) => {
          setCurrentStroke(strokeNum + 1);
        }
      });
    }
  };

  // 暂停动画
  const pauseAnimation = () => {
    if (!writerRef.current || !isPlaying) return;
    
    writerRef.current.pauseAnimation();
    setIsPlaying(false);
  };

  // 测验功能
  const startQuiz = () => {
    if (!writerRef.current) return;
    
    writerRef.current.quiz({
      onMistake: (strokeData: any) => {
        console.log('笔顺错误', strokeData);
      },
      onCorrectStroke: (strokeData: any) => {
        setCurrentStroke(strokeData.strokeNum + 1);
      },
      onComplete: () => {
        setIsComplete(true);
        setCurrentStroke(totalStrokes);
        drawCompletionEffect();
      }
    });
    
    setIsPlaying(false);
    setIsComplete(false);
  };
  
  // 重置动画函数
  const resetAnimation = () => {
    if (!writerRef.current) return;
    
    // 重置状态
    setCurrentStroke(0);
    setIsPlaying(false);
    setIsComplete(false);
    
    // 重置HanziWriter
    writerRef.current.cancelQuiz();
    writerRef.current.cancelAnimation();
    writerRef.current.hideCharacter();
    
    // 移除完成效果
    if (containerRef.current) {
      const oldEffect = containerRef.current.querySelector('#completion-effect');
      if (oldEffect) {
        oldEffect.remove();
      }
    }
  };
  
  // 完成所有笔画后的庆祝效果
  const drawCompletionEffect = () => {
    if (!containerRef.current) return;
    
    const effectSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    effectSvg.setAttribute('width', '200');
    effectSvg.setAttribute('height', '200');
    effectSvg.style.position = 'absolute';
    effectSvg.style.top = '0';
    effectSvg.style.left = '0';
    effectSvg.style.pointerEvents = 'none';
    effectSvg.style.zIndex = '2';
    effectSvg.id = 'completion-effect';
    
    // 移除之前的效果
    const oldEffect = containerRef.current.querySelector('#completion-effect');
    if (oldEffect) {
      oldEffect.remove();
    }
    
    // 绘制星星
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const distance = 70;
      const x = 100 + distance * Math.cos(angle);
      const y = 100 + distance * Math.sin(angle);
      const size = 10 + Math.random() * 5;
      const color = strokeColors[i % strokeColors.length];
      
      const star = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      let starPath = 'M ' + x + ' ' + (y - size) + ' ';
      for (let j = 1; j < 5; j++) {
        const angle = (j * 2 * Math.PI) / 5 - Math.PI / 2;
        const innerAngle = angle + Math.PI / 5;
        const x1 = x + size * Math.cos(angle);
        const y1 = y + size * Math.sin(angle);
        const x2 = x + (size/2) * Math.cos(innerAngle);
        const y2 = y + (size/2) * Math.sin(innerAngle);
        starPath += 'L ' + x1 + ' ' + y1 + ' L ' + x2 + ' ' + y2 + ' ';
      }
      starPath += 'Z';
      
      star.setAttribute('d', starPath);
      star.setAttribute('fill', color);
      star.style.opacity = '0';
      star.style.transform = 'scale(0)';
      star.style.transformOrigin = 'center';
      star.style.transition = 'all 0.5s ease-out';
      
      effectSvg.appendChild(star);
      
      // 动画延迟
      setTimeout(() => {
        star.style.opacity = '0.5';
        star.style.transform = 'scale(1)';
      }, i * 100);
    }
    
    containerRef.current.appendChild(effectSvg);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xs mx-auto">
      <div className="relative w-full aspect-square max-w-[250px]">
        <div 
          ref={containerRef} 
          className="w-full h-full rounded-xl shadow-md overflow-hidden"
          style={{ width: '200px', height: '200px', margin: '0 auto', position: 'relative' }}
        />
        
        {/* 笔画进度指示器 */}
        <div className="absolute bottom-2 left-2 bg-white bg-opacity-70 px-2 py-1 rounded-full text-xs font-medium shadow-sm">
          <span className="text-pink-500 font-bold">{currentStroke}</span>
          <span className="text-gray-600">/{totalStrokes} 笔画</span>
        </div>
      </div>
      
      <div className="flex gap-3 mt-4 w-full justify-center">
        {isPlaying ? (
          <button 
            onClick={pauseAnimation}
            className="px-5 py-2 bg-amber-100 text-amber-700 rounded-full hover:bg-amber-200 text-sm font-medium shadow-sm transition-all flex items-center justify-center min-w-[80px]"
            aria-label="暂停动画"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            暂停
          </button>
        ) : (
          <button 
            onClick={playAnimation}
            className="px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 text-sm font-medium shadow-sm transition-all flex items-center justify-center min-w-[80px]"
            aria-label="播放动画"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            {isComplete ? '重播' : '播放'}
          </button>
        )}
        
        <button 
          onClick={startQuiz}
          className="px-5 py-2 bg-pink-100 text-pink-700 rounded-full hover:bg-pink-200 text-sm font-medium shadow-sm transition-all flex items-center justify-center min-w-[80px]"
          aria-label="测验笔顺"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6.56 1.14a.75.75 0 01.888.43c.236.648.64 1.119 1.212 1.402.552.27 1.2.34 1.912.34.461 0 .993-.046 1.516-.143a.75.75 0 01.75.648c.046.47.053.949.026 1.438a.75.75 0 01-.262.578 1.6 1.6 0 00-.532 1.076c0 .47.18.898.532 1.14a.75.75 0 01.262.578 5.42 5.42 0 01-.076 1.5.75.75 0 01-.61.61c-.275.047-.565.047-.865.035a1.898 1.898 0 00-1.996 1.996c.012.3.012.59-.035.865a.75.75 0 01-.61.61c-.49.072-.98.079-1.5.076a.75.75 0 01-.578-.262 1.6 1.6 0 00-1.14-.532 1.6 1.6 0 00-1.076.532.75.75 0 01-.578.262c-.49.003-.97-.004-1.438-.05a.75.75 0 01-.648-.75c-.097-.523-.143-1.055-.143-1.516 0-.712.07-1.36.34-1.912.283-.572.754-.976 1.402-1.212a.75.75 0 01.43-.888c.648-.236 1.119-.64 1.402-1.212.27-.552.34-1.2.34-1.912 0-.461-.046-.993-.143-1.516a.75.75 0 01.648-.75c.47-.046.949-.053 1.438-.026a.75.75 0 01.578.262 1.6 1.6 0 001.076.532 1.6 1.6 0 001.14-.532.75.75 0 01.578-.262c.49-.027.968-.02 1.438.026zM9.1 17.1a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5a.75.75 0 01-.75-.75zm0-5a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5a.75.75 0 01-.75-.75zm0-5a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5a.75.75 0 01-.75-.75z" clipRule="evenodd" />
          </svg>
          测验
        </button>
      </div>
    </div>
  );
};

export default StrokeAnimation;