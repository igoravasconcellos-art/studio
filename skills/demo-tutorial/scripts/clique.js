// Clique ou movimento do mouse no macOS, para navegar no app real e tirar prints.
// Uso: osascript -l JavaScript clique.js <x> <y> [move]
// x e y em PONTOS da tela (pixel do screencapture ÷ 2 em tela Retina).
ObjC.import('CoreGraphics');
function run(argv) {
  var x = parseFloat(argv[0]), y = parseFloat(argv[1]), tipo = argv[2] || 'click';
  var p = $.CGPointMake(x, y);
  $.CGEventPost($.kCGHIDEventTap, $.CGEventCreateMouseEvent(null, $.kCGEventMouseMoved, p, 0));
  if (tipo === 'move') return;
  delay(0.15);
  $.CGEventPost($.kCGHIDEventTap, $.CGEventCreateMouseEvent(null, $.kCGEventLeftMouseDown, p, 0));
  $.CGEventPost($.kCGHIDEventTap, $.CGEventCreateMouseEvent(null, $.kCGEventLeftMouseUp, p, 0));
}
