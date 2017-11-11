var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "blue";
ctx.fillRect(0, 0, canvas.width, canvas.height);

function Creature (world, x, y) {
  this.network = new Architect.Perceptron(40, 25, 3);
  this.world = world;
  this.mass = 0.3;
  this.maxspeed = 2;
  this.maxforce = 0.2;
  this.lookRange = this.mass * 200;
  this.length = this.mass * 10;
  this.base = this.length * 0.5;
  this.HALF_PI = Math.PI * 0.5;
  this.TWO_PI = Math.PI * 2;
  this.location = new Vector(x, y);
  this.velocity = new Vector(0, 0);
  this.acceleration = new Vector(0, 0);
  this.color = '#222222';
}

Creature.prototype = {

  moveTo: function (networkOutput) {
    var force = new Vector(0, 0);

    var target = new Vector(networkOutput[0] * this.world.width, networkOutput[1] * this.world.height);
    var angle = (networkOutput[2] * this.TWO_PI) - Math.PI;

    var separation = this.separate(this.world.creatures);
    var alignment = this.align(this.world.creatures).setAngle(angle);
    var cohesion = this.seek(target);

    force.add(separation);
    force.add(alignment);
    force.add(cohesion);

    this.applyForce(force);
  },

  draw: function ()	{
    this.update();

    var ctx = this.world.context;
    ctx.lineWidth = 1;

    var angle = this.velocity.angle();

    x1 = this.location.x + Math.cos(angle) * this.base;
    y1 = this.location.y + Math.sin(angle) * this.base;

    x2 = this.location.x + Math.cos(angle + this.HALF_PI) * this.base;
    y2 = this.location.y + Math.sin(angle + this.HALF_PI) * this.base;

    x3 = this.location.x + Math.cos(angle - this.HALF_PI) * this.base;
    y3 = this.location.y + Math.sin(angle - this.HALF_PI) * this.base;

    ctx.lineWidth = 2;
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.stroke();
    ctx.fill();
  },

  update: function ()	{
    this.boundaries();
    this.velocity.add(this.acceleration);
	    this.velocity.limit(this.maxspeed);
	    if (this.velocity.mag() < 1.5)	    	{ this.velocity.setMag(1.5); }
	    this.location.add(this.velocity);
	    this.acceleration.mul(0);
  },

  applyForce: function (force)	{
    this.acceleration.add(force);
  },

  boundaries: function ()	{
    if (this.location.x < 15) { this.applyForce(new Vector(this.maxforce * 2, 0)); }

    if (this.location.x > this.world.width - 15) { this.applyForce(new Vector(-this.maxforce * 2, 0)); }

    if (this.location.y < 15) { this.applyForce(new Vector(0, this.maxforce * 2)); }

    if (this.location.y > this.world.height - 15) { this.applyForce(new Vector(0, -this.maxforce * 2)); }
  },

  seek: function (target)	{
    var seek = target.copy().sub(this.location);
    seek.normalize();
    seek.mul(this.maxspeed);
    seek.sub(this.velocity).limit(0.3);

    return seek;
  },

  separate: function (neighboors)	{
    var sum = new Vector(0, 0);
    var count = 0;

    for (var i in neighboors)		{
      if (neighboors[i] != this)			{
        var d = this.location.dist(neighboors[i].location);
        if (d < 24 && d > 0)				{
          var diff = this.location.copy().sub(neighboors[i].location);
          diff.normalize();
          diff.div(d);
          sum.add(diff);
          count++;
        }
      }
    }
    if (!count) { return sum; }

    sum.div(count);
    sum.normalize();
    sum.mul(this.maxspeed);
    sum.sub(this.velocity);
    sum.limit(this.maxforce);

    return sum.mul(2);
  },

  align: function (neighboors)	{
    var sum = new Vector(0, 0);
    var count = 0;
    for (var i in neighboors)		{
      if (neighboors[i] != this)// && !neighboors[i].special)
			{
        sum.add(neighboors[i].velocity);
        count++;
      }
    }
    sum.div(count);
    sum.normalize();
    sum.mul(this.maxspeed);

    sum.sub(this.velocity).limit(this.maxspeed);

    return sum.limit(0.1);
  },

  cohesion: function (neighboors)	{
    var sum = new Vector(0, 0);
    var count = 0;
    for (var i in neighboors)		{
      if (neighboors[i] != this)// && !neighboors[i].special)
			{
        sum.add(neighboors[i].location);
        count++;
      }
    }
    sum.div(count);

    return sum;
  }
};

function Vector (x, y) {
  this.x = x;
  this.y = y;
}

Vector.prototype = {
  set: function (x, y)	{
    this.x = x;
    this.y = y;

    return this;
  },
  add: function (v)	{
    this.x += v.x;
    this.y += v.y;

    return this;
  },
  sub: function (v)	{
    this.x -= v.x;
    this.y -= v.y;

    return this;
  },
  mul: function (s)	{
    this.x *= s;
    this.y *= s;

    return this;
  },
  div: function (s)	{
    !s && console.log('Division by zero!');

    this.x /= s;
    this.y /= s;

    return this;
  },
  mag: function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  },
  normalize: function ()	{
    var mag = this.mag();
    mag && this.div(mag);
    return this;
  },
  angle: function ()	{
    return Math.atan2(this.y, this.x);
  },
  setMag: function (m)	{
    var angle = this.angle();
    this.x = m * Math.cos(angle);
    this.y = m * Math.sin(angle);
    return this;
  },
  setAngle: function (a)	{
    var mag = this.mag();
    this.x = mag * Math.cos(a);
    this.y = mag * Math.sin(a);
    return this;
  },
  rotate: function (a)	{
    this.setAngle(this.angle() + a);
    return this;
  },
  limit: function (l)	{
    var mag = this.mag();
    if (mag > l) { this.setMag(l); }
    return this;
  },
  angleBetween: function (v)	{
    return this.angle() - v.angle();
  },
  dot: function (v)	{
    return this.x * v.x + this.y * v.y;
  },
  lerp: function (v, amt)	{
    this.x += (v.x - this.x) * amt;
    this.y += (v.y - this.y) * amt;
    return this;
  },
  dist: function (v)	{
    var dx = this.x - v.x;
    var dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  },
  copy: function ()	{
    return new Vector(this.x, this.y);
  },
  random: function () {
    this.set(1, 1);
    this.setAngle(Math.random() * Math.PI * 2);
    return this;
  }
};

function blastoff () {
  var canvas = $('#canvas')[0];
  var ctx = canvas.getContext('2d');

  var num = 10;
  var fps = 100;

  canvas.width = $('#canvas-container').width();
  $(window).resize(function () {
    var width = $('#canvas-container').width();
    canvas.width = width;
    world.width = width;
  });

  var world = {
    width: 0,
    height: 0,
    creatures: [],
    width: canvas.width,
    height: canvas.height,
    context: ctx
  };

	// popullate
  for (var i = 0; i < num; i++)	{
    var x = Math.random() * world.width;
    var y = Math.random() * world.height;

    world.creatures[i] = new Creature(world, x, y);
    world.creatures[i].velocity.random();
  }

  var targetX = function (creature) {
    var cohesion = creature.cohesion(world.creatures);
    return cohesion.x / world.width;
  };

  var targetY = function (creature) {
    var cohesion = creature.cohesion(world.creatures);
    return cohesion.y / world.height;
  };

  var targetAngle = function (creature) {
    var alignment = creature.align(world.creatures);
    return (alignment.angle() + Math.PI) / (Math.PI * 2);
  };

  var loop = function ()	{
		// fade effect
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = '#f4f4f4';
    ctx.fillRect(0, 0, world.width, world.height);
    ctx.globalAlpha = 1;

		// update each creature
    var creatures = world.creatures;
    creatures.forEach(function (creature)		{
			// move
      var input = [];
      for (var i in creatures)			{
        input.push(creatures[i].location.x);
        input.push(creatures[i].location.y);
        input.push(creatures[i].velocity.x);
        input.push(creatures[i].velocity.y);
      }
      var output = creature.network.activate(input);
      creature.moveTo(output);

			// learn
      var learningRate = 0.3;
      var target = [targetX(creature), targetY(creature), targetAngle(creature)];
      creature.network.propagate(learningRate, target);

			// draw
      creature.draw();
    });

    setTimeout(loop, 1000 / fps);
  };

	// blastoff
  loop();
}

blastoff();
