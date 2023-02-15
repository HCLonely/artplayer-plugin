"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.artplayerPlaylist = void 0;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var artplayerPlaylist = function artplayerPlaylist(options) {
  return function (art) {
    // 更换分集视频
    var changeVideo = function changeVideo(art, index) {
      if (!options.playlist[index]) {
        return;
      }

      // 更新i18n
      var addedI18n = {
        'zh-cn': {
          playlist: '播放列表'
        },
        en: {
          playlist: 'Playlist'
        }
      };
      art.i18n.update(addedI18n);

      // 获取artplayer配置
      var artOptions = art.option;
      var newArtplayer = art;
      if (options.rebuildPlayer) {
        var _options$autoNext;
        // 销毁之前的artplayer
        art.destroy();

        // 重建artplayer
        newArtplayer = new Artplayer(_objectSpread(_objectSpread(_objectSpread({}, artOptions), options.playlist[index]), {}, {
          autoplay: (_options$autoNext = options.autoNext) !== null && _options$autoNext !== void 0 ? _options$autoNext : artOptions.autoplay,
          i18n: addedI18n
        }));
      } else {
        art.switchUrl(options.playlist[index].url, options.playlist[index].title);
        if (artOptions.autoplay) {
          art.play();
        }
      }

      // 执行onchanged回调
      if (typeof options.onchanged === 'function') {
        options.onchanged(newArtplayer);
      }
    };

    // 自动播放下一集
    var currentEp = options.playlist.findIndex(function (videoInfo) {
      return videoInfo.url === art.option.url;
    });
    if (options.autoNext && currentEp < options.playlist.length) {
      art.on('video:ended', function () {
        changeVideo(art, currentEp + 1);
      });
    }

    // 添加播放列表
    art.controls.add({
      name: 'playlist',
      position: 'right',
      html: art.i18n.get('playlist'),
      style: {
        padding: '0 10px'
      },
      selector: options.playlist.map(function (videoInfo, index) {
        return {
          html: "".concat(index + 1, ". ").concat(videoInfo.title || "Ep.".concat(index + 1)),
          index: index,
          "default": currentEp === index
        };
      }),
      onSelect: function onSelect(item) {
        changeVideo(art, item.index);
        return art.i18n.get('playlist');
      }
    });
    return {
      name: 'playlist'
    };
  };
};
exports.artplayerPlaylist = artplayerPlaylist;
if (typeof window !== 'undefined') {
  window.artplayerPlaylist = artplayerPlaylist;
}
