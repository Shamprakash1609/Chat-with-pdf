from index import ask
#import streamlit as st 

#st.title("Chat with PDF")

#with st.chat_message("assistant"):
#    st.write("Hello ,How can I help you 👋")

#prompt = st.chat_input("Say Something")
#if prompt:
#    st.chat_message("user").markdown(prompt)
#    response = ask(prompt)
#    st.chat_message("assistant").markdown(response)

import streamlit as st

st.title("Chat With PDF")

# Initialize chat history
if "messages" not in st.session_state:
    st.session_state.messages = []

# Display chat messages from history on app rerun
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# React to user input
if prompt := st.chat_input("What is up?"):
    # Display user message in chat message container
    st.chat_message("user").markdown(prompt)
    # Add user message to chat history
    st.session_state.messages.append({"role": "user", "content": prompt})

    response = ask(prompt)
    # Display assistant response in chat message container
    with st.chat_message("assistant"):
        st.markdown(response)
    # Add assistant response to chat history
    st.session_state.messages.append({"role": "assistant", "content": response})
