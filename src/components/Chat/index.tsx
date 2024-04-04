import styles from './Chat.module.scss';
import {
  CrossIcon,
  RefreshIcon,
} from 'renderer/icons';
import { createSignal, For } from 'solid-js'
import * as Dialog from '@radix-ui/react-dialog';
import Post from '../Posts/Post';
import TextareaAutosize from 'react-textarea-autosize';
import Status from './Status';
import { AnimatePresence, motion } from 'framer-motion';
import VirtualList from './VirtualList';
import Blobs from './Blobs';

const renderResponse = (response) => {
  if (!response) return;
  const sources = response.sourceNodes;
  return (
    <For each= { sources } >
    {(source) => <div class={ styles.post }>
      <Post
            key={ `post-${source.metadata.relativeFilePath}` }
postPath = { source.metadata.relativeFilePath }
  />
  </div>}
  < /For>
  )
};


export default function Chat() {
  const [text, setText] = createSignal('');
  const [querying, setQuerying] = createSignal(false);
  const [response] = createSignal(null);

  const onResetConversation = () => {
    setText('');
  };

  const onSubmit = () => {
    setQuerying(true);
    const message = `${text()}`;
    setText('');
    // chat(message)
    //   .then((res) => {
    //     setHistory((his) =>
    //       his.map((message) => {
    //         if (message == '@@PENDING@@') return res;
    //         return message;
    //       })
    //     );
    //   })
    //   .finally(() => {
    //     setQuerying(false);
    //   });
    setQuerying(false);
  };

  return (
    <>
    <Dialog.Root>
    <Dialog.Trigger asChild >
    <div class= { styles.iconHolder } >
    <ChatIcon class={ styles.chatIcon } />
      < /div>
      < /Dialog.Trigger>
      < Dialog.Portal container = { container } >
        <Dialog.Overlay class={ styles.DialogOverlay } />
          < Dialog.Content class={ styles.DialogContent }>
            <div class={ styles.scroller }>
              <div class={ styles.wrapper }>
                <div class={ styles.wrapperUnderlay }> </div>
                  < Blobs show = { querying() } />
                    <Dialog.Title class={ styles.DialogTitle }>
                      <Status setReady={ setReady } />
                        < /Dialog.Title>
                        < div class={ styles.buttons }>
                          <div class={ styles.button } onClick = { onResetConversation } >
                            <RefreshIcon class={ styles.icon } />
                    Clear chat
    < /div>
    < Dialog.Close asChild >
      <button
                      class={ `${styles.close}` }
  aria - label="Close Chat"
    >
    <CrossIcon />
    < /button>
    < /Dialog.Close>
    < /div>
    < /div>
    < AnimatePresence >
    <div class={ styles.answer }>
      <VirtualList data={ history } />
        < /div>
        < /AnimatePresence>

        < div class={ styles.inputBar }>
          <AnimatePresence>
          <div class={ styles.inputbaroverlay }> </div>
            < motion.div
  key = "input"
  initial = {{ opacity: 0, y: 50 }
}
animate = {{ opacity: 1, y: 0 }}
exit = {{ opacity: 0 }}
transition = {{ delay: 0.1 }}
class={ styles.bar }
                  >
  <TextareaAutosize
                      value={ text() }
onChange = { onChangeText }
class={ styles.textarea }
onKeyDown = { handleKeyPress }
placeholder = "Start chatting..."
autoFocus
  />
  <div class={ styles.buttons }>
    <button
                        class={
  `${styles.ask} ${querying && styles.processing
    }`
}
onClick = { onSubmit }
disabled = { querying() }
  >
  { querying() ? (
    <Thinking class={ styles.spinner } />
                        ) : (
  'Ask'
)}
</button>
  < /div>
  < /motion.div>
  < motion.div
key = "disclaimer"
initial = {{ opacity: 0 }}
animate = {{ opacity: 0.6 }}
exit = {{ opacity: 0 }}
transition = {{ delay: 0.3 }}
class={ styles.disclaimer }
                  >
                    * AI can make mistakes.Consider checking important
information.
                  < /motion.div>
  < /AnimatePresence>
  < /div>
  < /div>
  < /Dialog.Content>
  < /Dialog.Portal>
  < /Dialog.Root>
  < div ref = { setContainer } />
    </>
  );
}
