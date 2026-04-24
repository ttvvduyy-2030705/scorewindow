package com.aplus.score

import android.content.Intent
import android.media.session.MediaSession
import android.media.session.PlaybackState
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.KeyEvent
import com.billiards_management.RemoteControl.RemoteControlModule
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.bridge.Arguments
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  companion object {
    private const val NEW_GAME_HOLD_DURATION_MS = 2_000L
    private const val REMOTE_FLOW_TAG = "REMOTE_FLOW"
  }

  private var mediaSession: MediaSession? = null
  private val mainHandler = Handler(Looper.getMainLooper())
  private var pendingNewGameHoldRunnable: Runnable? = null
  private var heldNewGameKeyCode: Int? = null
  private var newGameHoldTriggered = false

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(null)
    Log.i(REMOTE_FLOW_TAG, "REMOTE_FLOW: MainActivity onCreate")
    setupRemoteMediaSession()
  }

  override fun onDestroy() {
    Log.i(REMOTE_FLOW_TAG, "REMOTE_FLOW: MainActivity onDestroy")
    clearPendingNewGameHold(resetTriggered = true)
    mediaSession?.isActive = false
    mediaSession?.release()
    mediaSession = null
    super.onDestroy()
  }

  override fun getMainComponentName(): String = "billiards_management"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
    DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  private fun describeAction(action: Int): String {
    return when (action) {
      KeyEvent.ACTION_DOWN -> "DOWN"
      KeyEvent.ACTION_UP -> "UP"
      KeyEvent.ACTION_MULTIPLE -> "MULTIPLE"
      else -> action.toString()
    }
  }

  private fun logKey(stage: String, event: KeyEvent?, extra: String = "") {
    if (event == null) {
      Log.i(REMOTE_FLOW_TAG, "REMOTE_FLOW: $stage event=null $extra")
      return
    }

    Log.i(
      REMOTE_FLOW_TAG,
      "REMOTE_FLOW: $stage keyCode=${event.keyCode} action=${describeAction(event.action)}(${event.action}) scanCode=${event.scanCode} repeat=${event.repeatCount} deviceId=${event.deviceId} source=${event.source} flags=${event.flags} enabled=${isRemoteControlEnabled()} $extra",
    )
  }

  private fun emitRemoteEvent(eventName: String, keyCodeValue: String, event: KeyEvent) {
    logKey(
      stage = "emitRemoteEvent event=$eventName logical=$keyCodeValue",
      event = event,
    )

    val map = Arguments.createMap()
    map.putString("keyCode", keyCodeValue)
    map.putInt("keyCodeInt", event.keyCode)
    map.putInt("scanCode", event.scanCode)
    map.putInt("action", event.action)
    map.putInt("repeatCount", event.repeatCount)
    RemoteControlModule.sendEvent(eventName, map)
  }

  private fun isRemoteControlEnabled(): Boolean {
    return RemoteControlModule.isRemoteControlEnabled()
  }

  private fun emitRawRemoteEvent(eventName: String, event: KeyEvent): Boolean {
    logKey(stage = "emitRawRemoteEvent event=$eventName", event = event)

    val map = Arguments.createMap()
    map.putString("keyCode", event.keyCode.toString())
    map.putInt("keyCodeInt", event.keyCode)
    map.putInt("scanCode", event.scanCode)
    map.putInt("action", event.action)
    map.putInt("repeatCount", event.repeatCount)
    RemoteControlModule.sendEvent(eventName, map)
    return true
  }

  private fun isNewGameHoldKey(keyCode: Int): Boolean {
    return keyCode == KeyEvent.KEYCODE_ENTER ||
      keyCode == KeyEvent.KEYCODE_NUMPAD_ENTER ||
      keyCode == KeyEvent.KEYCODE_DPAD_CENTER
  }

  private fun clearPendingNewGameHold(resetTriggered: Boolean) {
    pendingNewGameHoldRunnable?.let { mainHandler.removeCallbacks(it) }
    pendingNewGameHoldRunnable = null
    heldNewGameKeyCode = null

    if (resetTriggered) {
      newGameHoldTriggered = false
    }

    Log.i(REMOTE_FLOW_TAG, "REMOTE_FLOW: clearPendingNewGameHold resetTriggered=$resetTriggered")
  }

  private fun emitHeldNewGameEvent() {
    Log.i(REMOTE_FLOW_TAG, "REMOTE_FLOW: emitHeldNewGameEvent synthetic ENTER")
    val syntheticEvent = KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_ENTER)
    emitRawRemoteEvent("onRemoteKeyDown", syntheticEvent)
  }

  private fun handleNewGameHold(event: KeyEvent): Boolean {
    logKey(stage = "handleNewGameHold", event = event)

    when (event.action) {
      KeyEvent.ACTION_DOWN -> {
        if (event.repeatCount > 0) {
          Log.i(REMOTE_FLOW_TAG, "REMOTE_FLOW: handleNewGameHold ignore repeat")
          return true
        }

        if (pendingNewGameHoldRunnable != null || newGameHoldTriggered) {
          Log.i(REMOTE_FLOW_TAG, "REMOTE_FLOW: handleNewGameHold ignore because already pending/triggered")
          return true
        }

        heldNewGameKeyCode = event.keyCode
        newGameHoldTriggered = false

        val holdRunnable = Runnable {
          if (heldNewGameKeyCode != event.keyCode) {
            Log.i(REMOTE_FLOW_TAG, "REMOTE_FLOW: newGameHold runnable aborted key mismatch")
            return@Runnable
          }

          pendingNewGameHoldRunnable = null
          newGameHoldTriggered = true

          Log.i(REMOTE_FLOW_TAG, "REMOTE_FLOW: newGameHold completed keyCode=${event.keyCode}")
          emitHeldNewGameEvent()
        }

        pendingNewGameHoldRunnable = holdRunnable
        mainHandler.postDelayed(holdRunnable, NEW_GAME_HOLD_DURATION_MS)

        Log.i(
          REMOTE_FLOW_TAG,
          "REMOTE_FLOW: newGameHold started keyCode=${event.keyCode} duration=$NEW_GAME_HOLD_DURATION_MS",
        )
        return true
      }

      KeyEvent.ACTION_UP -> {
        if (!newGameHoldTriggered) {
          Log.i(REMOTE_FLOW_TAG, "REMOTE_FLOW: newGameHold cancelled keyCode=${event.keyCode}")
        }

        clearPendingNewGameHold(resetTriggered = true)
        return true
      }
    }

    return true
  }

  private fun setupRemoteMediaSession() {
    Log.i(REMOTE_FLOW_TAG, "REMOTE_FLOW: setupRemoteMediaSession start")
    val session = MediaSession(this, "AplusRemoteSession")
    session.setCallback(
      object : MediaSession.Callback() {
        override fun onMediaButtonEvent(mediaButtonIntent: Intent): Boolean {
          val keyEvent: KeyEvent? =
            mediaButtonIntent.getParcelableExtra(Intent.EXTRA_KEY_EVENT)

          if (keyEvent == null) {
            Log.i(REMOTE_FLOW_TAG, "REMOTE_FLOW: mediaButton event=null")
            return super.onMediaButtonEvent(mediaButtonIntent)
          }

          val logicalKey =
            when (keyEvent.keyCode) {
              KeyEvent.KEYCODE_MEDIA_PLAY,
              KeyEvent.KEYCODE_MEDIA_PLAY_PAUSE,
              KeyEvent.KEYCODE_MEDIA_PAUSE -> "START"

              KeyEvent.KEYCODE_MEDIA_STOP -> "STOP"

              KeyEvent.KEYCODE_MEDIA_NEXT,
              KeyEvent.KEYCODE_MEDIA_FAST_FORWARD -> "BREAK"

              KeyEvent.KEYCODE_MEDIA_PREVIOUS,
              KeyEvent.KEYCODE_MEDIA_REWIND -> "WARM_UP"

              else -> null
            }

          logKey(
            stage = "MediaSession onMediaButtonEvent logical=$logicalKey",
            event = keyEvent,
          )

          if (logicalKey != null) {
            if (!isRemoteControlEnabled()) {
              Log.i(REMOTE_FLOW_TAG, "REMOTE_FLOW: mediaButton ignored because remote disabled")
              return false
            }

            when (keyEvent.action) {
              KeyEvent.ACTION_DOWN -> emitRemoteEvent("onRemoteKeyDown", logicalKey, keyEvent)
              KeyEvent.ACTION_UP -> emitRemoteEvent("onRemoteKeyUp", logicalKey, keyEvent)
            }
            return true
          }

          Log.i(REMOTE_FLOW_TAG, "REMOTE_FLOW: mediaButton no logical mapping, passing to super")
          return super.onMediaButtonEvent(mediaButtonIntent)
        }
      },
    )

    val playbackState =
      PlaybackState.Builder()
        .setActions(
          PlaybackState.ACTION_PLAY or
            PlaybackState.ACTION_PAUSE or
            PlaybackState.ACTION_PLAY_PAUSE or
            PlaybackState.ACTION_STOP or
            PlaybackState.ACTION_SKIP_TO_NEXT or
            PlaybackState.ACTION_SKIP_TO_PREVIOUS or
            PlaybackState.ACTION_FAST_FORWARD or
            PlaybackState.ACTION_REWIND,
        )
        .setState(PlaybackState.STATE_PAUSED, 0L, 1.0f)
        .build()

    session.setPlaybackState(playbackState)
    session.isActive = true
    mediaSession = session
    Log.i(REMOTE_FLOW_TAG, "REMOTE_FLOW: setupRemoteMediaSession ready active=${session.isActive}")
  }

  private fun isTextInputFocused(): Boolean {
    val focusedView = currentFocus ?: return false
    val className = focusedView.javaClass.name

    return focusedView.onCheckIsTextEditor() ||
      className.contains("EditText", ignoreCase = true) ||
      className.contains("ReactEditText", ignoreCase = true)
  }

  override fun dispatchKeyEvent(event: KeyEvent): Boolean {
    logKey(stage = "dispatchKeyEvent", event = event)

    if (isTextInputFocused()) {
      Log.i(REMOTE_FLOW_TAG, "REMOTE_FLOW: dispatchKeyEvent bypass because text input focused")
      return super.dispatchKeyEvent(event)
    }

    if (!isRemoteControlEnabled()) {
      Log.i(REMOTE_FLOW_TAG, "REMOTE_FLOW: dispatchKeyEvent remote disabled -> super")
      return super.dispatchKeyEvent(event)
    }

    if (isNewGameHoldKey(event.keyCode)) {
      Log.i(REMOTE_FLOW_TAG, "REMOTE_FLOW: dispatchKeyEvent routed to handleNewGameHold")
      return handleNewGameHold(event)
    }

    return when (event.action) {
      KeyEvent.ACTION_DOWN -> emitRawRemoteEvent("onRemoteKeyDown", event)
      KeyEvent.ACTION_UP -> emitRawRemoteEvent("onRemoteKeyUp", event)
      else -> {
        Log.i(REMOTE_FLOW_TAG, "REMOTE_FLOW: dispatchKeyEvent action not handled -> super")
        super.dispatchKeyEvent(event)
      }
    }
  }

  override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
    logKey(stage = "onKeyDown", event = event, extra = "requestedKeyCode=$keyCode")
    return super.onKeyDown(keyCode, event)
  }

  override fun onKeyUp(keyCode: Int, event: KeyEvent?): Boolean {
    logKey(stage = "onKeyUp", event = event, extra = "requestedKeyCode=$keyCode")
    return super.onKeyUp(keyCode, event)
  }
}
