## tinys

tinys is an command tool to compress and resize local images or web images with tinify APIs. You can get compressed images with size that you want.

Before you use it to compress images, a tinify key is needed. You can get the developer API key from [TinyPNG](https://tinify.cn/developers.). It's free with 500 times per month.

### Install

```powershell
$ npm install tinys -g
```



### How to use

You can get help

```powershell
$ tinys -h
```

#### Key

key is needed to use tinify APIs to compress or resize images.So set key firstly

```powershell
$ tinys config -k <your API key>
```

Then you can check your key

```powershell
$ tinys config -l
```



#### Proxy

You can set your proxy with command

```powershell
$ tinys config -p <proxyUrl>
```



#### Compress

After set the API key, you can start to compress image

```powershell
$ tinys [fromPath] [toPath]
```

`fromPath` can be file or directory, `toPath` must be directory when the fromPath is directory.If you do not set toPath, it will create a new directory named 'tiny' and compress images to it. 

**(1) Compress local image**

```powershell
$ tinys ./tiny.png 
```

Then `tiny.png` will be save to a new directory `./tiny`.So it's path is `./tiny/tiny.png`.

Also you can set the image name:

```powershell
// the compress image will be test.png
$ tinys ./tiny.png test.png
```

```powershell
// new directory tiny will be created
$ tinys ./tiny.png ./tiny/test.png
```

**(2) Compress local directory images**

In order to make it easy to compress many images.You can compress all images in a directory to another directory:

```powershell
// all images in tiny will be compressed to compress directory
$ tinys ./tiny ./compress
```

**(3) Download and compress web images**

You can download web images and compress them with:

```powershell
$ tinys url <imgUrl> <imgUrl> <imgUrl> ...
```

All images will be compressed to a directory `./tiny`.Of course, you can set a directory to store these images, it will be store in the global config:

```powershell
$ tinys config -d <compressDir>
```



#### Resize

You can resize image according to set resize type, image width, image height config.There are four resize method:

##### scale

Scale the picture down. You must provide the target width or height, **not both**. The reduced image will have a certain width or height.

```powershell
$ tinys url -m scale -w 1000 <url> <url> 

$ tinys <fromPath> <toPath> -m scale -w 1000
```

##### fit

Scale the picture to fit the given size. **You have to provide both width and height**. The reduced image will not exceed any of these sizes.

```powershell
$ tinys url -m fit -w 1000 -h 1000 <url> <url>

$ tinys <fromPath> <toPath> -m fit -w 1000 -h 1000
```

##### cover

Reduce the size of the picture to scale and cut the image if necessary.  **You have to provide both width and height**. 

```powershell
$ tinys url -m cover -w 1000 -h 1000 <url> <url>

$ tinys <fromPath> <toPath> -m cover -w 1000 -h 1000
```

The results have accurate given size. Which part of the picture will be cut is automatically determined. The intelligent algorithm determines the most important region in the image.

##### thumb

A more advanced implementation of the thumbnail, but also can detect the simple background of the cut image.  **You have to provide both width and height**. 

```powershell
$ tinys url -m thumb -w 1000 -h 1000 <url> <url> 

$ tinys <fromPath> <toPath> -m thumb -w 1000 -h 1000
```

The image will be reduced to the size of the width and height you provide. If an image is detected as an independent object, the algorithm will add more background in the necessary position, or cut out the unimportant parts.

see more detail and examples on https://tinify.cn/developers/reference/nodejs.



#### Config 

You can set resize config like key then you do not need to input many param every time.

```powershell
$ tinys config -m <resizeType>

$ tinys config -w <resizeWidth>

$ tinys config -h <resizeHeight>
```

You can check all configs:

```powershell
$ tinys config -l
```

You can clear all configs:

```powershell
$ tinys config -c
```

You can delete one config param:

```powershell
$ tinys config -D <param>
```

