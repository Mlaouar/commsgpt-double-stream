import asyncio
import json

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse


app = FastAPI()


# Allow CORS for the specified origins
origins = [
    "http://localhost:5555",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def generate_chunks():
    long_message = """
    Once upon a time in a computer, there were two important components: the CPU and the GPU. 
    The CPU, or Central Processing Unit, was known as the brain of the computer. It handled 
    all the general-purpose tasks and made sure everything ran smoothly. The GPU, or Graphics 
    Processing Unit, was the artist. It specialized in rendering images, videos, and animations, 
    making everything look beautiful on the screen. Together, they worked in harmony to provide 
    a seamless computing experience. The CPU would process the data, and the GPU would render 
    the visuals, creating a perfect balance between performance and aesthetics. And so, they 
    lived happily ever after, powering countless applications and games for users around the world.
    """
    tokens = long_message.split()
    for token in tokens:
        chunk = json.dumps({"choices": [{"delta": {"content": token}}]})
        yield f"{chunk}\n"
        await asyncio.sleep(0.1)  # Simulate delay for each token
    # Final chunk with extra information
    final_chunk = json.dumps(
        {
            "choices": [{"delta": {"content": ""}}],
            "usage": {"prompt_tokens": 5, "completion_tokens": len(tokens), "total_tokens": 5 + len(tokens)},
        }
    )
    yield f"{final_chunk}\n"


@app.post("/chat/completions")
async def chat_completions():
    return StreamingResponse(generate_chunks(), media_type="text/event-stream")


if __name__ == "__main__":
    uvicorn.run("streaming_app:app", host="localhost", port=5555)
