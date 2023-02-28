/*--------------------
Settings
--------------------*/
const init = () => {
    const canvas = document.querySelector('#matter-canvas')
    const wrap = document.querySelector('#wrap')
    const win = {
      w: window.innerWidth,
      h: window.innerHeight
    }
  
    wrap.style.width = `${win.w}px`
    wrap.style.height = `${win.h}px`
  
    /*--------------------
  Modules
  --------------------*/
    const {
      Engine,
      Render,
      Runner,
      Bodies,
      Composite,
      Composites,
      Mouse,
      MouseConstraint,
      Vertices
    } = Matter
  
    const engine = Engine.create()
  
    const render = Render.create({
      canvas: canvas,
      engine: engine,
      options: {
        width: win.w,
        height: win.h,
        background: 'transparent',
        pixelRatio: 1,
        showAngleIndicator: false,
        wireframes: false
      }
    })
  
    /*--------------------
  Boxes
  --------------------*/
    const options = {
      isStatic: true,
      render: {
        visible: false
      }
    }
    const walls = [
      Bodies.rectangle(win.w * 0.5, -25, win.w, 50, options),
      Bodies.rectangle(win.w * 0.5, win.h + 25, win.w, 50, options),
      Bodies.rectangle(-25, win.h * 0.5, 50, win.h, options),
      Bodies.rectangle(win.w + 25, win.h * 0.5, 50, win.h, options)
    ]
  
    const stack = Composites.stack(0, 0, win.w / 20, 10, 10, 10, function (x, y) {
      return Bodies.circle(x, y * 0.1, win.w < 768 ? 10 : 18, {
        restitution: 0.9,
        render: {
          sprite: {
            xScale: win.w < 768 ? 0.5 : 0.8,
            yScale: win.w < 768 ? 0.5 : 0.8,
            texture:
            'https://raw.githubusercontent.com/supahfunk/supah-codepen/master/user-default-avatar.jpg'
          }
        }
      })
    })
    Composite.add(engine.world, [...walls, stack])
  
    const createPath = (path) => {
      const p = path
      .replaceAll(',', '')
      .split(' ')
      .map((n) => n * win.w * 0.0044)
      .join(' ')
      return Vertices.fromPath(p)
    }
  
    const offset = win.h * 0.4
  
    const zeroPath = createPath(
      '0 11, 3 3, 11 0, 19 3, 22 12, 22 29, 19 38, 11 41, 3 38, 0 29'
    )
    const zeros = [0.414, 0.53, 0.645].map(i => (
      Bodies.fromVertices(
        win.w * i,
        offset,
        zeroPath,
        options,
        true
      )
    ))
    const pointPath = createPath('0 0, 2 30, 5 30, 7 0')
    const point = Bodies.fromVertices(
      win.w * 0.735,
      win.h * -0.034 + offset,
      pointPath,
      options,
      true
    )
    const point2 = Bodies.rectangle(
      win.w * 0.735,
      win.h * 0.085 + offset,
      win.w * 0.024,
      win.w * 0.024,
      options
    )
    Composite.add(engine.world, [...zeros, point, point2])
  
    const fives = [
      {
        x: win.w * 0.298,
        y: win.w * -0.075 + offset,
        w: win.w * 0.085,
        h: win.w * 0.024,
      },
      {
        x: win.w * 0.265,
        y: win.w * -0.03 + offset,
        w: win.w * 0.022,
        h: win.w * 0.07,
      },
      {
        x: win.w * 0.298,
        y: win.w * -0.017 + offset,
        w: win.w * 0.04,
        h: win.w * 0.024,
      },
      {
        x: win.w * 0.33,
        y: win.w * 0.027 + offset,
        w: win.w * 0.022,
        h: win.w * 0.09,
      },
      {
        x: win.w * 0.298,
        y: win.w * 0.075 + offset,
        w: win.w * 0.04,
        h: win.w * 0.024,
      },
      {
        x: win.w * 0.265,
        y: win.w * 0.062 + offset,
        w: win.w * 0.022,
        h: win.w * 0.035,
      },
    ].map(({x,y,w,h}) => (
      Bodies.rectangle(
        x,
        y,
        w,
        h,
        options
      )
    ))
    Composite.add(engine.world, fives)
  
    /*--------------------
  Mouse
  --------------------*/
    const mouse = Mouse.create(render.canvas),
          mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
              stiffness: 0.2,
              render: {
                visible: false
              }
            }
          })
    Composite.add(engine.world, mouseConstraint)
    render.mouse = mouse
  
    /*--------------------
  Run
  --------------------*/
    Render.run(render)
    var runner = Runner.create()
    Runner.run(runner, engine)
  }
  
  window.addEventListener('load', init)