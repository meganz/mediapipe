#!/bin/bash
set -e
# set -x

GIT_REVISION=5659fd3d28d9d744fdeb4635ed60899c38527a2d

function checkBazel {
    if [ -z "`which bazel`" ]; then
        echo -n "You need to install Bazelisk first. For Debian, you can download a release binary from the Bazelisk\n\
             Github repo, i.e. https://github.com/bazelbuild/bazelisk/releases/download/v1.20.0/bazelisk-linux-amd64\n\
            and run it within the Bazel project dir"
        exit 1
    fi
}

if [ -z "$1" ]; then
    echo "This is a script to build the modified js version Mediapipe, as used in Mega"
    echo -e "Please specify one of the commands: \n\
       deps: Lists the names of the (debian) packages for the
             required dependencies. Convenient for use with apt install \`build.sh deps\`\n\
       fetch: Clones the mediapipe repository and patches it\n\
       native: Builds the native mediapipe framework and a test app\n\
       npm: Builds the modified mediapipe/vision nodejs module\n\
       clean: Clear everything to start from scratch"
    exit 1
elif [ "$1" == "deps" ]; then
    echo libopencv-video-dev libopencv-contrib-dev mesa-common-dev libegl1-mesa-dev libgles2-mesa-dev
    exit 0
elif [ "$1" == "fetch" ]; then
    if [ ! -d "./mediapipe" ]; then
        rm -f ./.patched
        mkdir ./mediapipe
        cd ./mediapipe
        git init --initial-branch=master
        git remote add origin https://github.com/google/mediapipe.git
        git fetch --depth=1 origin $GIT_REVISION
        git checkout -f FETCH_HEAD
    else
        cd ./mediapipe
        echo -e "\e[93;1mMediapipe repo already cloned\e[0m"
    fi
    if [ ! -f "./.patched" ]; then
        echo "Patching Mediapipe..."
        git apply < ../mega.patch
        touch ../.patched
    else
        echo -e "\e[93;1mMediapipe repo already patched\e[0m"
    fi
elif [ "$1" == "native" ]; then
    checkBazel
    cd mediapipe
    bazel run --copt -DMESA_EGL_NO_X11_HEADERS --copt -DEGL_NO_X11 mediapipe/examples/desktop/hello_world:hello_world
elif [ "$1" == "npm" ]; then
    checkBazel
    rm -rf ./npm-pkg
    cd mediapipe
    bazel build mediapipe/tasks/web/vision:vision_pkg
    mkdir ../npm-pkg
    cp ./bazel-bin/mediapipe/tasks/web/vision/vision_pkg/{package.json,README.md,vision_bundle.mjs,vision_bundle.mjs.map,wasm/vision_wasm_internal.js,wasm/vision_wasm_internal.wasm}\
        ../npm-pkg
    ln -s ../vision.d.ts ../npm-pkg
    echo "==== NPM package generated in ./npm-pkg ===="
elif [ "$1" == "clean" ]; then
    bazel clean
    rm -rf mediapipe/bazel-bin/mediapipe/tasks/web
else
    echo "Invalid command '$1'"
    exit 2
fi

echo -e "\e[32;1mDone\e[0m"
