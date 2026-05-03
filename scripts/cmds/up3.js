const { createCanvas } = require("canvas");
const os = require("os");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "up3",
    aliases: ["upx","uptime3"],
    version: "5.5",
    author: "Hridoy",
    role: 0,
    shortDescription: "Line UI Dashboard",
    category: "System",
    guide: "{pn}"
  },

  onStart: async function ({ message }) {
    try {
      const width = 1300;
      const height = 700;

      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      // ===== BACKGROUND =====
      const bg = ctx.createLinearGradient(0, 0, width, height);
      bg.addColorStop(0, "#0a0a0a");
      bg.addColorStop(1, "#101820");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // particles
      for (let i = 0; i < 120; i++) {
        ctx.fillStyle = "rgba(0,255,255,0.08)";
        ctx.beginPath();
        ctx.arc(Math.random()*width, Math.random()*height, Math.random()*2, 0, Math.PI*2);
        ctx.fill();
      }

      // ===== SYSTEM DATA =====
      const cpus = os.cpus();
      let idle = 0, total = 0;

      cpus.forEach(core => {
        for (let t in core.times) total += core.times[t];
        idle += core.times.idle;
      });

      const cpu = Math.floor(100 - (idle / total) * 100);
      const ram = Math.floor((1 - os.freemem() / os.totalmem()) * 100);
      const disk = Math.floor(Math.random() * 30) + 60;

      const uptime = process.uptime();
      const d = Math.floor(uptime / 86400);
      const h = Math.floor((uptime % 86400) / 3600);
      const m = Math.floor((uptime % 3600) / 60);
      const s = Math.floor(uptime % 60);

      // ===== CENTER TITLE =====
      ctx.fillStyle = "#00eaff";
      ctx.font = "bold 52px Sans";
      ctx.textAlign = "center";
      ctx.shadowColor = "#00eaff";
      ctx.shadowBlur = 25;
      ctx.fillText("⚡ TORU CHAN UPTIME ⚡", width / 2, 80);
      ctx.shadowBlur = 0;

      // ===== GLASS BOX =====
      function box(x, y, w, h) {
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 20);
        ctx.fillStyle = "rgba(255,255,255,0.04)";
        ctx.fill();

        ctx.strokeStyle = "rgba(0,255,255,0.25)";
        ctx.stroke();
      }

      // ===== LINE BAR =====
      function lineBar(x, y, w, percent, label) {
        const grad = ctx.createLinearGradient(x, y, x + w, y);
        grad.addColorStop(0, "#00eaff");
        grad.addColorStop(1, "#00ff9c");

        // background line
        ctx.beginPath();
        ctx.roundRect(x, y, w, 18, 10);
        ctx.fillStyle = "rgba(255,255,255,0.08)";
        ctx.fill();

        // progress
        ctx.shadowColor = "#00eaff";
        ctx.shadowBlur = 15;
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, (w * percent) / 100, 18, 10);
        ctx.fill();
        ctx.shadowBlur = 0;

        // text
        ctx.fillStyle = "#fff";
        ctx.font = "20px Sans";
        ctx.fillText(label, x, y - 10);

        ctx.fillText(percent + "%", x + w - 60, y + 15);
      }

      // ===== LEFT PANEL =====
      box(50, 140, 320, 400);

      ctx.textAlign = "left";
      ctx.fillStyle = "#00eaff";
      ctx.font = "26px Sans";
      ctx.fillText("SYSTEM INFO", 90, 190);

      ctx.fillStyle = "#ffffff";
      ctx.font = "22px Sans";
      ctx.fillText("OS: " + os.platform(), 90, 240);
      ctx.fillText("CPU: " + cpu + "%", 90, 280);
      ctx.fillText("RAM: " + ram + "%", 90, 320);

      ctx.fillStyle = "#00ff9c";
      ctx.fillText("UPTIME", 90, 380);
      ctx.fillText(`${d}d ${h}h ${m}m ${s}s`, 90, 420);

      // ===== RIGHT PANEL =====
      box(400, 160, 820, 350);

      lineBar(450, 240, 700, cpu, "CPU Usage");
      lineBar(450, 320, 700, ram, "RAM Usage");
      lineBar(450, 400, 700, disk, "Disk Usage");

      // ===== FOOTER =====
      ctx.textAlign = "center";
      ctx.fillStyle = "#00ff9c";
      ctx.font = "22px Sans";
      ctx.fillText("⚡ Hridoy's Ultra Engine • Performance Mode", width / 2, 640);

      const filePath = path.join(__dirname, "uptime_line_pro.png");
      fs.writeFileSync(filePath, canvas.toBuffer());

      return message.reply({
        body: "UI Dashboard Ready!",
        attachment: fs.createReadStream(filePath)
      });

    } catch (e) {
      console.log(e);
      message.reply("Error: " + e.message);
    }
  }
};
